// Third Party
import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

//Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';

const BountyList = ({ bounties }) => {
	// Hooks
	const [appState] = useContext(StoreContext);
	const [displayBounties, updateDisplayBounties] = useState([]);
	const [tvlBounties, updateTvlBounties] = useState([]);
	const [unfundedVisible, setUnfundedVisible] = useState(false);
	const [claimedVisible, setClaimedVisible] = useState(false);
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [searchedBounties, setSearchedBounties]= useState([]);
	console.log(bounties);
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

	const removeUnfunded = (bounties) => {
		return bounties.filter((elem) => {
			return elem.tvl?.total > 0;
		});
	};

	const removeClaimed = (bounties) => {
		return bounties.filter((elem) => {
			return elem.status === 'OPEN';
		});
	};

	// Process props
	const availableLabels=[];
	bounties.forEach((bounty)=>{
		bounty.labels.forEach(label=>{
			if(!availableLabels.includes(label)){
				availableLabels.push(label.name);
			}			
		});
	});

	useEffect(() => {
		async function getTvls() {
			const newBounties = await bounties.map(async (elem,) => {
				let tvl = await getTVL(elem.bountyTokenBalances);
				return { ...elem, tvl };
			});

			const resolvedTvls = await Promise.all(newBounties);
			const initialDisplayBounties = removeUnfunded(removeClaimed(resolvedTvls));
			updateDisplayBounties(initialDisplayBounties);
			setSearchedBounties(initialDisplayBounties);
			updateTvlBounties(resolvedTvls);
		}
		getTvls();
	}, [bounties]);
	useEffect(()=>{
		search(searchText);
	},[displayBounties]);
	// Methods
	const handleSearchInput = (e) =>{
		search(e.target.value);
	};
	const search = (searchValue) => {
		const myRegex = /(tag:)(\w+)/g;
		const tagArr=[...searchValue.matchAll(myRegex, '$2')];		
		const issueTitleSearchTerm = searchValue.replace(myRegex, ' ').trim();
		updateSearchText(searchValue);
		setSearchedBounties(displayBounties.filter((bounty) => {
			const includesTags=tagArr.reduce((accum, tag)=>{
				if (!accum) return accum;
				else return bounty.labels.some(label=>{return label.name===tag[2];});

			}, true);
			return searchValue
				? (bounty.title
					.toLowerCase()
					.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
					&& includesTags):
				bounty;
		}));
	};
	
	const orderBounties = (toggleTo, bounties = displayBounties) => {
		switch (toggleTo) {
		case 'Highest\xa0TVL':
			updateDisplayBounties(bounties.sort((a, b) => {
				return b.tvl.total - a.tvl.total;
			}));
			break;
		case 'Lowest\xa0TVL':
			updateDisplayBounties(bounties.sort((a, b) => {
				return a.tvl.total - b.tvl.total;
			}));
			break;
		case 'Newest':
			updateDisplayBounties(bounties.sort((a, b) => {
				return b.bountyMintTime - a.bountyMintTime;
			}));
			break;
		case 'Oldest':
			updateDisplayBounties(bounties.sort((a, b) => {
				return a.bountyMintTime - b.bountyMintTime;
			}));
			break;
		}
		updateSortOrder(toggleTo);
	};

	const addTag = (tag)=>{
		search(searchText.concat(` tag:${tag}`));
	};

	const showUnfunded = (e) => {
		setUnfundedVisible(e.target.checked);
		if (e.target.checked) {
			if (claimedVisible) {
				orderBounties(sortOrder, tvlBounties);
			} else {
				orderBounties(sortOrder, removeClaimed(tvlBounties));
			}
		} else {
			updateDisplayBounties(removeUnfunded(displayBounties));
		}
	};

	const showClaimed = (e) => {
		setClaimedVisible(e.target.checked);
		if (e.target.checked) {
			if (unfundedVisible) {
				orderBounties(sortOrder, tvlBounties);
			} else {
				orderBounties(sortOrder, removeUnfunded(tvlBounties));
			}
		} else {
			updateDisplayBounties(removeClaimed(displayBounties));
		}
	};

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
					<Dropdown toggleFunc={addTag}  title="Filter By Label" names={availableLabels} borderShape={'rounded-r-lg'}/></div>	
				<MintBountyButton />
			</div>
			<div className="flex md:content-start content-center flex-col gap-2">
				<div className="flex bg-dark-mode justify-between rounded-md w-64">
					<span className="text-white p-2  align-self-center pr-4">Sort By</span>
					<Dropdown toggleFunc={orderBounties} toggleVal={sortOrder} names={['Newest', 'Oldest', 'Highest\xa0TVL', 'Lowest\xa0TVL']} borderShape={'rounded-md'}/>
				</div>
				<div className="flex p-2 pr-4 gap-2 border rounded-md justify-between border-web-gray w-64">
					<label htmlFor="unfunded" className="text-white">Show Unfunded Bounties</label>
					<input id="unfunded" type="checkbox" className="accent-pink-500" onChange={showUnfunded} />
				</div>
				<div className="flex p-2 pr-4 gap-2 border rounded-md justify-between border-web-gray w-64">
					<label htmlFor="claimed" className="text-white" >Show Claimed Bounties</label>
					<input id="claimed" type="checkbox" className="accent-pink-500" onChange={showClaimed} />
				</div>
			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{searchedBounties.length && searchedBounties.length}
				{searchedBounties.length == 1 ? ' Bounty found' : ' Bounties found'}
			</div>
			{searchedBounties.length != 0
				? searchedBounties.map((bounty) => {
					console.log(bounty);
					return <BountyCard bounty={bounty} key={bounty.bountyId} />;
				})
				: null}
		</div>
	);
};
export default BountyList;