// Third Party
import React, { useState, useEffect, useRef, useCallback } from 'react';

//Custom
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Skeleton from 'react-loading-skeleton';

const BountyList = ({ bounties, loading, complete, getMoreData, getNewData }) => {
	// Hooks
	const [unfundedVisible, setUnfundedVisible] = useState(true);
	const [claimedVisible, setClaimedVisible] = useState(false);
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [tagArr, updateTagArr] = useState([]);
	const [searchedBounties, updateSearchedBounties] = useState([]);
	const [isProcessed, updateIsProcessed] = useState(false);
	let observer = useRef();
	// Utilities
	
	
	const fetchPage = ()=>{
		if(sortOrder==='Oldest'){
			getMoreData('asc');
		}
		else if (sortOrder==='Newest'){
			getMoreData('desc');
		}
	};


	const filter = (bounties, options={})=>{
		const localTagArr = options.tagArr || tagArr;
		const localSearchText = options.searchText || searchText;
		const  localShowClaimed = options.showClaimed === undefined ? claimedVisible: options.showClaimed;
		const localShowUnfunded = options.showUnfunded === undefined ? unfundedVisible: options.showUnfunded;
		const displayBounties =  bounties.filter(bounty=>{
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
		if(displayBounties.length===0&&!complete){
			fetchPage();
		}
		else return displayBounties;

	};

	// Orders bounties	
	const orderBounties = (bounties = bounties, toggleTo=sortOrder ) => {
		if(toggleTo===sortOrder){return bounties;}
		switch (toggleTo) {
		case 'Newest':{
			if(complete){
				return bounties.sort((a, b) => {
					return b.bountyMintTime - a.bountyMintTime;
				});}
			else{
				getNewData('desc');
			}
		
		
		}
			break;
		case 'Oldest':{ 
			if(complete){
				return bounties.sort((a, b) => {
					return a.bountyMintTime - b.bountyMintTime;
				});}
			else{
				getNewData('asc');
			}
		
		
		}
		}
		return bounties;
	};


	useEffect(async() => {	
		updateIsProcessed(false);		
		if(!bounties)updateIsProcessed(true);
		else{
			updateSearchedBounties(filter(bounties));
			updateIsProcessed(true);
		}
	}, [bounties]);
	
	// User Methods
	const handleSortBounties = (toggleTo) =>{
		updateSortOrder(toggleTo);
		updateSearchedBounties(orderBounties(searchedBounties, toggleTo));
	};

	const handleSearchInput = (e) =>{
		updateSearchText(e.target.value);
		updateSearchedBounties(orderBounties(filter(bounties, {searchText: e.target.value})));
	};

	/* TODO New tag search 
	const addTag = (tag)=>{
		if(!tagArr.includes(tag)){
			updateTagArr([...tagArr, tag]);
			updateSearchedBounties(orderBounties(filter(bounties, {tagArr: [...tagArr, tag]})));}
	};
*/
	const showUnfunded = (e) => {
		setUnfundedVisible(e.target.checked);
		updateSearchedBounties(orderBounties(filter(bounties, {showUnfunded: e.target.checked})));
	};

	const showClaimed = (e) => {
		setClaimedVisible(e.target.checked);		
		updateSearchedBounties(orderBounties(filter(bounties, {showClaimed: e.target.checked})));
	};

	const removeTag = (e)=>{
		const newTagArr=tagArr.filter(tag=>tag!==e.target.value);
		updateTagArr(newTagArr);		
		updateSearchedBounties(orderBounties(filter(bounties, {tagArr: newTagArr})));
	};


	const lastElem = useCallback((node)=>{
		if(observer.current){observer.current.disconnect();}
		if(node){

			let options = {
				rootMargin: '50px',
				threshold: 1
			};
			const callback = (entries)=>{
				if(entries[0].isIntersecting&&isProcessed&&!complete&&!loading){
					fetchPage();
				}
		
			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}
	});

	
	// Render
	return (
		<div className="xl:col-start-2 justify-self-center space-y-3 px-5">
			<button className="text-white" onClick={()=>getMoreData('desc')}>getData</button>
			<div className="grid lg:grid-cols-[repeat(4,_1fr)] gap-6">
				<div className="flex rounded-lg z-10 relative lg:col-span-3 col-span-4 max-w-xs sm:max-w-none">
					<SearchBar
						onKeyUp={handleSearchInput}
						placeholder={'Search Issue...'}
						searchText={searchText}
						borderShape={'border-b border-l rounded-l-lg border-t w-36 sm:w-full'}
					/>
					{/*}	<Dropdown toggleFunc={addTag} title="Filter By Label" names={availableLabels} borderShape={'rounded-r-lg'} />*/}</div>
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
					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} names={['Newest', 'Oldest']} borderShape={'rounded-md'} />
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
					return <div key={index} ref={(index===searchedBounties.length-1)?lastElem: null}><BountyCard bounty={bounty}/></div>;
				})
			}
		</div>
	);
};
export default BountyList;