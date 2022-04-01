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
	const [unfundedVisible, setUnfundedVisible] = useState(false);
	const [claimedVisible, setClaimedVisible] = useState(false);
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [tagArr, updateTagArr] = useState([]);
	const [searchedBounties, updateSearchedBounties] = useState([]);
	const [isProcessed, updateIsProcessed] = useState(false);
	const [tagSearch, setTagSearch] = useState('Search');
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
		const localSearchText = options.searchText=== undefined ? searchText: options.searchText;
		const  localShowClaimed = options.showClaimed === undefined ? claimedVisible: options.showClaimed;
		const localShowUnfunded = options.showUnfunded === undefined ? unfundedVisible: options.showUnfunded;
		const displayBounties =  bounties.filter(bounty=>{
			
			const containsSearch = ((bounty.title+bounty.description)
				.toLowerCase()
				.indexOf(localSearchText.toLowerCase()) > -1)||
				bounty.labels.reduce((accum, label)=>{
					if(accum) return true;
					return( label.name.toLowerCase()
						.indexOf(localSearchText.toLowerCase()) > -1);
				}, false)||
				localSearchText.length===0;

			const containsTag = localTagArr.reduce((accum, tag)=>{
				if(accum===false) return false;
				return bounty.labels.some(label=>label.name===tag);
			}, true);

			const isUnclaimed = bounty.status === 'OPEN';
			const isFunded = bounty.deposits.length>0;
			return (containsSearch&&containsTag&&(localShowUnfunded||isFunded)&&(localShowClaimed||isUnclaimed));
		});
		if(displayBounties.length===0&&!complete){
			fetchPage();
			return [];
		}
		else return displayBounties;

	};

	// Orders bounties	
	const orderBounties = (bounties = [], toggleTo=sortOrder ) => {
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
		else {
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

	const handleTagInput = (e)=>{
		updateSearchText(e.target.value);
	};
	const addTag =()=>{
		if(!tagArr.includes(searchText)){
			updateTagArr([...tagArr, searchText]);
			updateSearchedBounties(orderBounties(filter(bounties, {tagArr: [...tagArr, searchText]})));
		}
		updateSearchText('');
	};
	const toggleTagSearch = (toggleVal)=>{
		if(toggleVal !== tagSearch){
			updateSearchText('');
			updateTagArr([]);
			updateSearchedBounties(orderBounties(filter(bounties, {tagArr: [], searchText: '', tagSearch: toggleVal})));
			if(toggleVal==='Search'){
				setTagSearch('Search');
			}
			else setTagSearch('Search Tags');
		}
	};

	const showUnfunded = () => {
		setUnfundedVisible(!unfundedVisible);
		updateSearchedBounties(orderBounties(filter(bounties, {showUnfunded: !unfundedVisible})));
	};

	const showClaimed = () => {
		setClaimedVisible(!claimedVisible);		
		updateSearchedBounties(orderBounties(filter(bounties, {showClaimed: !claimedVisible})));
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
		<div className="xl:col-start-2 justify-self-center space-y-3 xl:w-full xl:max-w-6xl">
			<div className="grid lg:grid-cols-[repeat(4,_1fr)] gap-6">
				<div className="flex rounded-lg lg:col-span-3 col-span-4 justify-center">
					{tagSearch==='Search' ?
						<SearchBar
							onKeyUp={handleSearchInput}
							placeholder={'Search Issue...'}
							searchText={searchText}
							borderShape={'border-b border-l rounded-l-lg border-t w-36 sm:w-full'}
						/>:
					
						<SearchBar
							onEnter={addTag}
							onKeyUp={handleTagInput}
							placeholder={'Enter Tag...'}
							searchText={searchText}
							borderShape={'border-b border-l rounded-l-lg border-t w-36 sm:w-full'}
						/>
					}
					<Dropdown toggleFunc={toggleTagSearch} title={tagSearch} width={36} names={['Search', 'Search Tags']} borderShape={'rounded-r-lg'}/>
				</div>
				<MintBountyButton />
			</div>
			{tagArr.length>0 && <ul className="flex flex-wrap">{tagArr.map((tag, index)=> <li key={index}className="border-web-gray border text-white inline mr-2 mb-2 px-2 py-1.5 rounded-md">
				<span className="px-2">{tag}</span>
				<button onClick={removeTag} value={tag} className="bg-inactive-gray hover:bg-active-gray hover:cursor-pointer inline-flex justify-center content-center h-6 w-6 leading-tight rounded-full">
					×
				</button>
				
			</li>)}
			</ul>}
			<div className="flex md:content-start content-center flex-wrap w-full justify-items-stretch gap-4">
				<div className="flex justify-between bg-dark-mode end rounded-md">
					<span className="text-white p-2 border-t border-l border-b rounded-l-md border-web-gray align-self-center pr-8">Sort By</span>
					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} names={['Newest', 'Oldest']} borderShape={'rounded-r-md'} width={36} />
				</div>
				<div className='flex flex-wrap gap-4'>
					<div onClick={showUnfunded} className="flex w-32 p-2 pr-4 gap-2 border rounded-md justify-between border-web-gray">
						<label htmlFor="unfunded" className="text-white pointer-events-none">Unfunded</label>
						<input id="unfunded" onChange={showUnfunded} type="checkbox" className="h-6 bg-no-repeat appearance-none w-4 h-4 checked:bg-inactive-accent checked:bg-[url('/checkbox.svg')] focus:outline-none border-2 border-web-gray  checked:border-inactive-accent rounded-sm
						m-1 bg-dark-mode accent-inactive-accent"checked={unfundedVisible} />
					</div>
					<div onClick={showClaimed} className="flex p-2 w-32 pr-4 gap-2 border rounded-md justify-between border-web-gray">
						<label htmlFor="claimed" className="text-white pointer-events-none" >Claimed</label>
						<input id="claimed" onChange={showClaimed} type="checkbox" className="h-6 bg-no-repeat appearance-none w-4 h-4 checked:bg-inactive-accent checked:bg-[url('/checkbox.svg')] focus:outline-none border-2 border-web-gray checked:border-inactive-accent rounded-sm
						m-1 bg-dark-mode accent-inactive-accent" checked={claimedVisible}/>
					</div>
				</div>
			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{process.env.NEXT_PUBLIC_DEPLOY_ENV === 'docker' ? !isProcessed || loading  ?
					<Skeleton  baseColor="#333" borderRadius={'1rem'} height={'12px'} width={100}/>:
					<>
						{searchedBounties.length && searchedBounties.length}
						{searchedBounties.length == 1 ? ' Bounty found' : ' Bounties found'}
					</>: null}
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