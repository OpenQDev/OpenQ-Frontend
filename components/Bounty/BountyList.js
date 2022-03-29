// Third Party
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';

//Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Skeleton from 'react-loading-skeleton';

const BountyList = ({ bounties, loading, complete,getMoreData }) => {
	// Hooks
	const [appState] = useContext(StoreContext);
	const [tvlBounties, updateTvlBounties] = useState([]);
	const [unfundedVisible, setUnfundedVisible] = useState(true);
	const [claimedVisible, setClaimedVisible] = useState(true);
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [tagArr, updateTagArr] = useState([]);
	const [searchedBounties, updateSearchedBounties] = useState([]);
	const [isProcessed, updateIsProcessed] = useState(false);
	const [scroll, setScroll] = useState();
	let observer = useRef();
	// Utilities
	const getTVL = async (tokenBalances) => {
		let tokenVolumes = {};
		tokenBalances.map((tokenBalance) => {
			const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
			tokenVolumes[tokenAddress] = tokenBalance.volume;
		});

		const data = { tokenVolumes };
		const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
		// only query tvl for bounties that have deposits
		if (JSON.stringify(data.tokenVolumes) != '{}') {
			try {
				const tokenValues = await appState.tokenClient.getTokenValues(data, url);
				return tokenValues;
			} catch (error) {
				console.error(error);
			}
		} else return { total: 0 };
	};

	const filter = (bounties, options={})=>{
		const localTagArr = options.tagArr || tagArr;
		const localSearchText = options.searchText || searchText;
		const  localShowClaimed = options.showClaimed === undefined ? claimedVisible: options.showClaimed;
		const localShowUnfunded = options.showUnfunded === undefined ? unfundedVisible: options.showUnfunded;
		return bounties.filter(bounty=>{
			const containsSearch = (bounty.title
				.toLowerCase()
				.indexOf(localSearchText.toLowerCase()) > -1)|| localSearchText.length===0;
			const containsTag = localTagArr.reduce((accum, tag)=>{
				if(accum===false) return false;
				return bounty.labels.some(label=>label.name===tag);
			},true);
			const isUnclaimed = bounty.status === 'OPEN';
			const isFunded = bounty.tvl?.total > 0;
			return (containsSearch&&containsTag&&(localShowUnfunded||isFunded)&&(localShowClaimed||isUnclaimed));
		});

	};

	// Orders bounties	
	const orderBounties = (bounties = tvlBounties, toggleTo=sortOrder ) => {
		switch (toggleTo) {
		case 'Highest\xa0TVL':
			return bounties.sort((a, b) => {
				return b.tvl.total - a.tvl.total;
			});
		case 'Lowest\xa0TVL':
			return bounties.sort((a, b) => {
				return a.tvl.total - b.tvl.total;
			});
		case 'Newest':
			return bounties.sort((a, b) => {
				return b.bountyMintTime - a.bountyMintTime;
			});
		case 'Oldest':
			return bounties.sort((a, b) => {
				return a.bountyMintTime - b.bountyMintTime;
			});
		}
		return bounties;
	};

	// Process props
	const availableLabels = [];
	bounties.forEach((bounty) => {
		bounty.labels.forEach(label => {
			if (!availableLabels.includes(label.name)) {
				availableLabels.push(label.name);
			}
		});
	});

	useEffect(async() => {
		updateIsProcessed(false);
		async function getTvls() {
			const newBounties = await bounties.map(async (elem,) => {
				let tvl = await getTVL(elem.bountyTokenBalances);
				return { ...elem, tvl };
			});

			const tvlPromise = Promise.all(newBounties);
			tvlPromise.then((resolvedTvls)=>{
				updateSearchedBounties(filter(resolvedTvls));
				updateTvlBounties(resolvedTvls);	
				updateIsProcessed(true);		
			}
			);
		}
		await getTvls();
	}, [bounties]);
	
	// User Methods
	const handleSortBounties = (toggleTo) =>{
		updateSortOrder(toggleTo);
		updateSearchedBounties(orderBounties(searchedBounties, toggleTo));
	};

	const handleSearchInput = (e) =>{
		updateSearchText(e.target.value);
		updateSearchedBounties(orderBounties(filter(tvlBounties, {searchText: e.target.value})));
	};

	const addTag = (tag)=>{
		if(!tagArr.includes(tag)){
			updateTagArr([...tagArr, tag]);
			updateSearchedBounties(orderBounties(filter(tvlBounties, {tagArr: [...tagArr, tag]})));}
	};

	const showUnfunded = (e) => {
		setUnfundedVisible(e.target.checked);
		updateSearchedBounties(orderBounties(filter(tvlBounties, {showUnfunded: e.target.checked})));
	};

	const showClaimed = (e) => {
		setClaimedVisible(e.target.checked);		
		updateSearchedBounties(orderBounties(filter(tvlBounties, {showClaimed: e.target.checked})));
	};

	const removeTag = (e)=>{
		const newTagArr=tagArr.filter(tag=>tag!==e.target.value);
		updateTagArr(newTagArr);		
		updateSearchedBounties(orderBounties(filter(tvlBounties, {tagArr: newTagArr})));
	};


	const lastElem = useCallback((node)=>{
		console.log(node);
		window.scrollY = scroll;
		if(observer.current){observer.current.disconnect();}
		if(node){

			let options = {
				rootMargin: '100px',
				threshold: .1
			};
			const callback = (entries)=>{
				console.log(entries);
				if(entries[0].isIntersecting){
					console.log(searchedBounties);
					console.log('exec');
					setScroll(window.scrollY);
					getMoreData('desc');
				}
		
			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}
	});
	/*
	useCallback((node)=>{
		}});
*/
	// Render
	return (
		<div className="xl:col-start-2 justify-self-center space-y-3 px-5">
			<div className="grid lg:grid-cols-[repeat(4,_1fr)] gap-6">
				<div className="flex rounded-lg z-10 relative lg:col-span-3 col-span-4 max-w-xs sm:max-w-none">
					<SearchBar
						onKeyUp={handleSearchInput}
						placeholder={'Search Issue...'}
						searchText={searchText}
						borderShape={'border-b border-l rounded-l-lg border-t w-36 sm:w-full'}
					/>
					<Dropdown toggleFunc={addTag} title="Filter By Label" names={availableLabels} borderShape={'rounded-r-lg'} /></div>
				<MintBountyButton />
			</div>
			{tagArr.length>0 && <ul className="flex  flex-wrap">{tagArr.map((tag, index)=> <li key={index}className="border-web-gray border text-white inline ml-2 mb-2 px-2 py-1.5 rounded-md">
				<span className="px-2">{tag}</span>
				<button onClick={removeTag} value={tag} className="bg-inactive-gray hover:bg-active-gray hover:cursor-pointer inline-flex justify-center content-center h-6 w-6 leading-tight rounded-full">
					×
				</button>
				
			</li>)}
			</ul>}
			<div className="flex md:content-start content-center flex-col gap-2">
				<div className="flex bg-dark-mode justify-between rounded-md w-64">
					<span className="text-white p-2  align-self-center pr-4">Sort By</span>
					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} names={['Newest', 'Oldest', 'Highest\xa0TVL', 'Lowest\xa0TVL']} borderShape={'rounded-md'} />
				</div>
				<div className="flex p-2 pr-4 gap-2 border rounded-md justify-between border-web-gray w-64">
					<label htmlFor="unfunded" className="text-white">Show Unfunded Bounties</label>
					<input id="unfunded" type="checkbox" className="accent-pink-500" onChange={showUnfunded} checked={unfundedVisible} />
				</div>
				<div className="flex p-2 pr-4 gap-2 border rounded-md justify-between border-web-gray w-64">
					<label htmlFor="claimed" className="text-white" >Show Claimed Bounties</label>
					<input id="claimed" type="checkbox" className="accent-pink-500" onChange={showClaimed} checked={claimedVisible}/>
				</div>
			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{ !isProcessed || loading ?
					<Skeleton  baseColor="#333" borderRadius={'1rem'} height={'12px'} width={100}/>:
					<>
						{searchedBounties.length && searchedBounties.length}
						{searchedBounties.length == 1 ? ' Bounty found' : ' Bounties found'}
					</>}
			</div>
			{ !isProcessed || loading?
				<>
					<BountyCard loading={true} />
					<BountyCard loading={true} />
				</>:
				searchedBounties.map((bounty, index) => {
					return <div key={bounty.bountyId} ref={lastElem}><BountyCard bounty={bounty}/></div>;
				})
			}
		</div>
	);
};
export default BountyList;
{/*ref={(index+1===searchedBounties.length)? lastElem:null*/}
/*
	const lastElem =	useCallback((node)=>{
		window.scrollY = scroll;
		if(observer.current){observer.current.disconnect();}
		if(node){
			lastElem();

			let options = {
				rootMargin: '0px',
				threshold: .5
			};
			const callback = (entries)=>{
				if(entries[0].isIntersecting){
					setScroll(window.scrollY);
					if(!complete)getBountyData(sortOrder==='Newest');
				}
		
			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}},[searchedBounties]);*/