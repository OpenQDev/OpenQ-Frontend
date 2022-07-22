// Third party
import React, { useState, useEffect, useRef, useCallback } from 'react';

//Custom
import BountyCardLean from '../Bounty/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import useWeb3 from '../../hooks/useWeb3';
import searchFoundInText	from './SearchHelpers/searchFoundInText';
import searchFoundInLabels from './SearchHelpers/searchFoundInLabels';
import searchTagInBounty from './SearchHelpers/searchTagInBounty';
import Toggle from '../Utils/Toggle';

const BountyList = ({ bounties, watchedBounties,  loading, complete, getMoreData, getNewData, addCarousel, labelProp }) => {
	// Hooks
	const {account} = useWeb3();
	const [fundedOnly, setFundedOnly] = useState(false);
	const [unclaimedOnly, setUnclaimedOnly] = useState(false);
	const [unassignedOnly, setUnassignedOnly] = useState(false);
	/* const [l2eOnly, setL2eOnly] = useState(false); */
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [tagArr, updateTagArr] = useState([]);
	const [searchedBounties, updateSearchedBounties] = useState([]);
	const [isProcessed, updateIsProcessed] = useState(false);
	const [tagSearch, setTagSearch] = useState('Search by Text');
	const [isReady, setIsReady] = useState('Ready for work');
	let observer = useRef();
	// Utilities
	const fetchPage = () => {

		switch(sortOrder){
		case 'Newest':
			{	getMoreData('desc');}
			break;
		case 'Oldest':
			{getMoreData('asc');}
			break;
		case 'Highest':
			{	getMoreData('desc', 'tvl');}
			break;
		case 'Lowest':
			{	getMoreData('asc', 'tvl');}
			break;
		case 'Popular':
			{ getMoreData('desc', 'views');}
			break;

	
		}
	};

	// NOTE tag search doesn't turn off regular search, it just manages it a little differently.
	const filter = (bounties, options = {}) => {
		const localTagArr = options.tagArr || tagArr;
		const localSearchText = options.searchText === undefined ? searchText : options.searchText;
		const localUnclaimedOnly = options.unclaimedOnly === undefined ? unclaimedOnly : options.unclaimedOnly;
		const localFundedOnly = options.fundedOnly === undefined ? fundedOnly : options.fundedOnly;
		const localUnassignedOnly = options.unassignedOnly === undefined ? unassignedOnly : options.unassignedOnly;
		/* const localL2eOnly = options.l2eOnly === undefined ? l2eOnly: options.l2eOnly; */

		const displayBounties = bounties.filter((bounty) => {
			const hasLabel = !labelProp || bounty.labels.reduce((accum, label) => {
				if (accum) return true;
				return (label.name.toLowerCase() === labelProp.toLowerCase());
			}, false);

			let containsSearch = true;

			try{

				// Simple search
				const lowerCaseSearch = localSearchText.toLowerCase();
				const isFoundInText = searchFoundInText(bounty.title, bounty.body, lowerCaseSearch);
				const isFoundInLabels = searchFoundInLabels(bounty, lowerCaseSearch);
				const emptySearchText = localSearchText.length === 0;
				containsSearch = isFoundInText ||	isFoundInLabels || emptySearchText;

				// Tags
				const containsTag = searchTagInBounty(bounty, localTagArr);

				// Check based filters
				const isUnclaimed = bounty.status === 'OPEN';
				const isFunded = bounty.deposits.some(deposit=>{
					return !deposit.refunded;
				});			
				const isAssigned = bounty.assignees?.nodes.length > 0;

				// Combine
				return (containsSearch && containsTag && (!localFundedOnly || isFunded) && (!localUnclaimedOnly || isUnclaimed) && (!localUnassignedOnly || !isAssigned )  && hasLabel && bounty.url && !bounty.blacklisted);
			}
			catch(err){
				console.log(err);}
		
		});

		if (displayBounties.length === 0 && !complete) {
			fetchPage();
			return [];
		}
		else return displayBounties;

	};

	// Orders bounties	
	const orderBounties = (bounties = [], toggleTo = sortOrder, firstLoad) => {
		if (toggleTo === sortOrder && !firstLoad) { return bounties; }
		switch (toggleTo) {
		case 'Newest': {
			if (complete || firstLoad) {
				return bounties.sort((a, b) => {
					return b.bountyMintTime - a.bountyMintTime;
				});
			}
			else {
				getNewData('desc');
			}


		}
			break;
		case 'Oldest': {
			if (complete || firstLoad) {
				return bounties.sort((a, b) => {
					return a.bountyMintTime - b.bountyMintTime;
				});
			}
			else {
				getNewData('asc');
			}
		}
			break;
		case 'Highest': {
			if( sortOrder !== toggleTo)	{
				getNewData('desc', 'tvl');}
		}
			break;
		case 'Lowest': {	
			if( sortOrder !== toggleTo)	{	
				getNewData('asc', 'tvl');
			}
			
		}
			break;
		case 'Popular': {	
			if( sortOrder !== toggleTo)	{	
				getNewData('desc', 'views');
			}
			
		}
			break;
		}
		return bounties;
	};


	useEffect(async () => {
		updateIsProcessed(false);
		if (!bounties) updateIsProcessed(true);
		else	 {
			updateSearchedBounties(orderBounties(filter(bounties), sortOrder, true));
			updateIsProcessed(true);
		}
	}, [bounties]);

	// User Methods
	const handleSortBounties = (toggleTo) => {
		updateSortOrder(toggleTo);
		updateSearchedBounties(orderBounties(searchedBounties, toggleTo));
	};

	const handleSearchInput = (e) => {
		updateSearchText(e.target.value);
		updateSearchedBounties(orderBounties(filter(bounties, { searchText: e.target.value })));
	};

	const handleTagInput = (e) => {
		updateSearchText(e.target.value);
	};
	const addTag = () => {
		if (!tagArr.includes(searchText)) {
			updateTagArr([...tagArr, searchText]);
			updateSearchedBounties(orderBounties(filter(bounties, { tagArr: [...tagArr, searchText] })));
		}
		updateSearchText('');
	};
	const toggleTagSearch = (toggleVal) => {
		if (toggleVal !== tagSearch) {
			updateSearchText('');
			updateTagArr([]);
			updateSearchedBounties(orderBounties(filter(bounties, { tagArr: [], searchText: '', tagSearch: toggleVal })));
			if (toggleVal === 'Search by Text') {
				setTagSearch('Search by Text');
			}
			else setTagSearch('Search by Tags');
		}
	};

	const showUnfunded = () => {
		setFundedOnly(!fundedOnly);
		updateSearchedBounties(orderBounties(filter(bounties, { fundedOnly: !fundedOnly })));
	};

	const showClaimed = () => {
		setUnclaimedOnly(!unclaimedOnly);
		updateSearchedBounties(orderBounties(filter(bounties, { unclaimedOnly: !unclaimedOnly })));
	};

	const showAssigned = () => {
		setUnassignedOnly(!unassignedOnly);
		updateSearchedBounties(orderBounties(filter(bounties, { unassignedOnly: !unassignedOnly })));
	};
	
	/* const filterByL2e = ()=>{
		setL2eOnly(!l2eOnly);		
		updateSearchedBounties(orderBounties(filter(bounties, { l2eOnly: !l2eOnly })));
	}; */

	const removeTag = (e) => {
		const newTagArr = tagArr.filter(tag => tag !== e.target.value);
		updateTagArr(newTagArr);
		updateSearchedBounties(orderBounties(filter(bounties, { tagArr: newTagArr })));
	};


	const lastElem = useCallback((node) => {
		if (observer.current) { observer.current.disconnect(); }
		if (node) {

			let options = {
				rootMargin: '100px',
				threshold: .1
			};
			const callback = (entries) => {
				if (entries[0].isIntersecting && isProcessed && !complete && !loading) {
					fetchPage();
				}

			};
			observer.current = new IntersectionObserver(callback, options);
			observer.current.observe(node);
		}
	});


	// Render
	return (
		<div className="lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8 max-w-[1024px] px-4 mx-auto">
			<div className="flex flex-wrap gap-4 w-full pt-10">
				<SearchBar
					onKeyUp={handleSearchInput}
					placeholder={'Search Issue...'}
					searchText={searchText}
					label={'search text'}
					styles={'rounded-sm'}
				/> 
				
				<MintBountyButton />
			</div>
			<div className='w-full rounded-sm'>
				<div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
				
					<Toggle names={['Ready for work', 'All issues']} toggleVal={isReady} toggleFunc={setIsReady} />

					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} styles="whitespace-nowrap" width="44"  title={`Sort Order: ${sortOrder}`} names={['Newest', 'Oldest', 'Highest', 'Lowest', 'Popular']} borderShape={'rounded-r-lg'} />
					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} styles="whitespace-nowrap" width="24" title="Labels" names={['Newest', 'Oldest', 'Highest', 'Lowest', 'Popular']} borderShape={'rounded-r-lg'} />

				</div>
			
			</div>
			{tagArr.length > 0 && <ul className="flex flex-wrap">{tagArr.map((tag, index) => <li key={index} className="border-web-gray border  inline mr-2 mb-2 px-2 py-1.5 rounded-lg">
				<span className="px-2">{tag}</span>
				<button aria-label={`remove ${tag} filter`} onClick={removeTag} value={tag} className="bg-inactive-gray hover:bg-active-gray hover:cursor-pointer inline-flex justify-center content-center h-6 w-6 leading-tight rounded-full">
					×
				</button>

			</li>)}
			</ul>}
			
			{addCarousel && account && watchedBounties.length ?
			
				<Carousel watchedBounties={watchedBounties} styles={'col-start-2'} >
					{watchedBounties.map((watchedBounty, index) => <CarouselBounty key={index} bounty={watchedBounty} />)}
				</Carousel>
				:
				null}
			<div className="md:border border-web-gray rounded-sm">
				{isProcessed && !loading &&
				searchedBounties.map((bounty, index) => {
					return <div key={bounty.id} ref={(index === searchedBounties.length - 1) ? lastElem : null}>
						<BountyCardLean index={index} length={searchedBounties.length }bounty={bounty} />
					</div>;
				})}
			</div>
			
		</div>
	);
};
export default BountyList;