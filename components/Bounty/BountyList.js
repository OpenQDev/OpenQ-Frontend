// Third Party
import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import Skeleton from 'react-loading-skeleton';

//Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';
import SearchBar from '../Search/SearchBar';
import MintBountyButton from '../MintBounty/MintBountyButton';

const BountyList = ({ bounties, loading }) => {
	// Hooks
	const [appState] = useContext(StoreContext);
	const [displayBounties, updateDisplayBounties] = useState([]);
	const [tvlBounties, updateTvlBounties] = useState([]);
	const [unfundedVisible, setUnfundedVisible] = useState(false);
	const [claimedVisible, setClaimedVisible] = useState(false);
	const [sortOrder, updateSortOrder] = useState('Newest');
	const [searchText, updateSearchText] = useState('');
	const [searchedBounties, updateSearchedBounties] = useState([]);
	
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

	// Filters out unfunded
	const removeUnfunded = (bounties) => {
		return bounties.filter((elem) => {
			return elem.tvl?.total > 0;
		});
	};
	// Filters out claimed

	const removeClaimed = (bounties) => {
		return bounties.filter((elem) => {
			return elem.status === 'OPEN';
		});
	};

	// Filters out non-searched
	const search = (searchValue, bounties=displayBounties) => {
		const myRegex = /(tag:)(")([\w\s]+)(")/g;
		const tagArr=[...searchValue.matchAll(myRegex, '$2')];	
		const issueTitleSearchTerm = searchValue.replace(myRegex, ' ').trim();
		updateSearchText(searchValue);

		return bounties.filter((bounty) => {
			const includesTags = tagArr.reduce((accum, tag) => {
				if (!accum) return accum;
				else return bounty.labels.some(label => { return label.name === tag[3]; });

			}, true);
			return searchValue
				? (bounty.title
					.toLowerCase()
					.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
					&& includesTags) :
				bounty;
		});
	};

	// Orders bounties	
	const orderBounties = (toggleTo, bounties = displayBounties) => {
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
			if (!availableLabels.includes(label)) {
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
			updateSearchedBounties(initialDisplayBounties);
			updateTvlBounties(resolvedTvls);
		}
		getTvls();
	}, [bounties]);

	// User Methods
	const handleSortBounties = (toggleTo) =>{
		updateSortOrder(toggleTo);
		updateSearchedBounties(orderBounties(toggleTo, searchedBounties));
	};

	const handleSearchInput = (e) =>{
		updateSearchText(e.target.value);
		updateSearchedBounties(search(e.target.value));
	};

	const addTag = (tag)=>{
		updateSearchText(searchText.concat(` tag:"${tag}"`));
		updateSearchedBounties(search(searchText.concat(` tag:"${tag}"`)));
	};

	const showUnfunded = (e) => {
		setUnfundedVisible(e.target.checked);
		if (e.target.checked) {
			if (claimedVisible) {
				updateDisplayBounties(orderBounties(sortOrder,tvlBounties));
				updateSearchedBounties(orderBounties(sortOrder, search (searchText, tvlBounties)));
			} else {
				updateDisplayBounties(orderBounties(sortOrder, removeClaimed(tvlBounties)));
				updateSearchedBounties(orderBounties(sortOrder, search (searchText, removeClaimed(tvlBounties))));
			}
		} else {
			updateDisplayBounties(search(searchText, removeUnfunded(displayBounties)));
			updateSearchedBounties(search(searchText, removeUnfunded(displayBounties)));
		}
	};

	const showClaimed = (e) => {
		setClaimedVisible(e.target.checked);
		if (e.target.checked) {
			if (unfundedVisible) {
				updateDisplayBounties(orderBounties(sortOrder, tvlBounties));
				updateSearchedBounties(orderBounties(sortOrder, search(searchText, tvlBounties)));
			} else {
				updateDisplayBounties(orderBounties(sortOrder, removeUnfunded(tvlBounties)));
				updateSearchedBounties(orderBounties(sortOrder, search(searchText, removeUnfunded(tvlBounties))));
			}
		} else {
			updateDisplayBounties(removeClaimed(displayBounties));
			updateSearchedBounties(search(searchText, removeClaimed(displayBounties)));
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
					<Dropdown toggleFunc={addTag} title="Filter By Label" names={availableLabels} borderShape={'rounded-r-lg'} /></div>
				<MintBountyButton />
			</div>
			<div className="flex md:content-start content-center flex-col gap-2">
				<div className="flex bg-dark-mode justify-between rounded-md w-64">
					<span className="text-white p-2  align-self-center pr-4">Sort By</span>
					<Dropdown toggleFunc={handleSortBounties} toggleVal={sortOrder} names={['Newest', 'Oldest', 'Highest\xa0TVL', 'Lowest\xa0TVL']} borderShape={'rounded-md'} />
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
			{loading? searchedBounties.length != 0
				&& searchedBounties.map((bounty) => {
					return <BountyCard bounty={bounty} key={bounty.bountyId} />;
				}):
				<><BountyCard loading={true}/><BountyCard loading={true}/><BountyCard loading={true}/><BountyCard loading={true}/><BountyCard loading={true}/><BountyCard loading={true}/></>
			}
		</div>
	);
};
export default BountyList;