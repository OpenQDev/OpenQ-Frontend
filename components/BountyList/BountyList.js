// Third party
import React, { useState, useEffect, useRef, useCallback } from 'react';

//Custom
import BountyCardLean from '../BountyCard/BountyCardLean';
import Dropdown from '../Utils/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Carousel from '../Utils/Carousel';
import CarouselBounty from '../Bounty/CarouselBounty';
import useWeb3 from '../../hooks/useWeb3';
import searchFoundInText	from './SearchHelpers/searchFoundInText';
import searchFoundInLabels from './SearchHelpers/searchFoundInLabels';
import searchTagInBounty from './SearchHelpers/searchTagInBounty';
import SmallToggle from '../Utils/SmallToggle';

const BountyList = ({ bounties, watchedBounties,  loading, complete, getMoreData, getNewData, addCarousel }) => {
	// Hooks
	const {account} = useWeb3();
	/* const [l2eOnly, setL2eOnly] = useState(false); */
	const [searchText, updateSearchText] = useState(' order:newest');
	const [tagArr, updateTagArr] = useState([]);
	const [searchedBounties, updateSearchedBounties] = useState([]);
	const [isProcessed, updateIsProcessed] = useState(false);
	const [isReady, setIsReady] = useState('Ready for work');
	const [labels, setLabels] = useState([]);
	
	const searchRegex = /label:"[^"]+"/gi;
	const orderRegex= /\order:(\w+)/gi;
	let observer = useRef();
	// Utilities
	const fetchPage = () => {
		const sortOrder = searchText.match(orderRegex)?.[0]?.slice(6)||'';
		switch(sortOrder){
		case 'newest':
			{	getMoreData('desc');}
			break;
		case 'oldest':
			{getMoreData('asc');}
			break;
		case 'highest':
			{	getMoreData('desc', 'tvl');}
			break;
		case 'lowest':
			{	getMoreData('asc', 'tvl');}
			break;
		case 'popular':
			{ getMoreData('desc', 'views');}
			break;

	
		}
	};

	useEffect(()=>{
		if(bounties){
			const labels = bounties?.reduce((accum, bounty)=>{
				const bountyLabels = bounty.labels.filter(label=>{
					const accumFilter = 	accum.some((accumLabel)=>{
				
						return (label.name.toLowerCase() === accumLabel.name.toLowerCase());
					});
					return !accumFilter;
				});
				return [...accum, ...bountyLabels];
			},[]).map(label=>label.name)||[];

			setLabels(labels);

		}
	}, [bounties]);
	// NOTE tag search doesn't turn off regular search, it just manages it a little differently.
	const filter = (bounties, options = {}) => {
		const localTagArr = options.tagArr || tagArr;
		const localSearchText = options.searchText === undefined ? searchText : options.searchText;
		const localIsReady = options.isReady === undefined ? isReady : options.isReady;
		/* const localL2eOnly = options.l2eOnly === undefined ? l2eOnly: options.l2eOnly; */
		
		const searchedLabelsWrapped = localSearchText.match(searchRegex)||[];
		const searchedLabels = searchedLabelsWrapped.map(elem=>elem.slice(7, -1));
		const displayBounties = bounties.filter((bounty) => {
			const hasLabels = searchedLabels.some((searchedLabel)=> bounty.labels.some(bountyLabel=>bountyLabel.name === searchedLabel))||searchedLabels.length === 0;
		

			let containsSearch = true;

			try{

				// Simple search
				let lowerCaseSearch = localSearchText.replace(searchRegex, '').toLowerCase().replace(orderRegex, '').trim();
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
				return (containsSearch && containsTag && ((( isFunded) && (isUnclaimed) && ( !isAssigned ) )|| localIsReady === 'All issues') && hasLabels && bounty.url && !bounty.blacklisted);
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
	const orderBounties = (bounties = [], firstLoad, changed, newOrder) => {
		if(!changed){
			return bounties;
		}
		const toggleTo = newOrder||searchText.match(orderRegex)?.[0]?.slice(6)||'';
		switch (toggleTo) {
		case 'newest': {
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
		case 'oldest': {
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
		case 'highest': {
			getNewData('desc', 'tvl');}
			break;
		case 'lowest': {
			getNewData('asc', 'tvl');
			
			
		}
			break;
		case 'popular': {	
			getNewData('desc', 'views');
			
			
		}
			break;
		}
		return bounties;
	};


	useEffect(async () => {
		updateIsProcessed(false);
		if (!bounties) updateIsProcessed(true);
		else	 {
			updateSearchedBounties(orderBounties(filter(bounties),  true));
			updateIsProcessed(true);
		}
	}, [bounties]);

	// User Methods
	const handleSortBounties = (toggleTo) => {
		updateSearchText(`${searchText.replace(orderRegex, '')} order:${toggleTo}`.replace(/\s+/g, ' '));
		updateSearchedBounties(orderBounties(filter(searchedBounties,{}), false, true, toggleTo));
	};

	const handleSearchInput = (e) => {
		updateSearchText(e.target.value);
		updateSearchedBounties(orderBounties(filter(bounties, { searchText: e.target.value })));
	};
	const addLabel = (label)=>{
		updateSearchText(`${searchText} label:"${label}"`);
		updateSearchedBounties(orderBounties(filter(bounties, { searchText: `${searchText} label:"${label}"` })));

	};
	
	const showUnready = (toggleVal) => {
		setIsReady(toggleVal );
		updateSearchedBounties(orderBounties(filter(bounties, { isReady: toggleVal })));
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
		<div className="lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[960px] mx-auto">
			<div className="flex flex-wrap gap-4 w-full items-center">
				<SearchBar
					onKeyUp={handleSearchInput}
					placeholder={'Search Issue...'}
					searchText={searchText}
					label={'search text'}
					styles={'rounded-sm w-full'}
				/> 
				
				<MintBountyButton styles={'w-full'} />
			</div>
			<div className='w-full rounded-sm'>
				<div className='flex flex-wrap gap-4 p-2 sm:p-4 border-web-gray border rounded-sm bg-subtle'>
				
					<SmallToggle names={['Ready for work', 'All issues']} toggleVal={(isReady ===  'Ready for work')? 'Ready for work': 'All issues'}  toggleFunc={showUnready} />

					<Dropdown toggleFunc={handleSortBounties} toggleVal={''} styles="whitespace-nowrap" width="32"  title={'Sort Order'} names={['newest', 'oldest', 'highest', 'lowest', 'popular']} borderShape={'rounded-r-lg'} />
					<Dropdown toggleFunc={addLabel} toggleVal={''} styles="whitespace-nowrap" width="24" title="Labels" names={labels} borderShape={'rounded-r-lg'} />

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
			{isProcessed && !loading && searchedBounties.length>0 &&
			<div className="md:border border-web-gray rounded-sm">
				{searchedBounties.map((bounty, index) => {
				
					return <div key={bounty.id} ref={(index === searchedBounties.length - 1) ? lastElem : null}>
						<BountyCardLean index={index} length={searchedBounties.length }bounty={bounty} />
					</div>;
				})}
			</div>
			}
		</div>
	);
};
export default BountyList;