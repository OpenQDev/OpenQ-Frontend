// Third Party
import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

//Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';
import SearchBar from '../Search/SearchBar';

const BountyList = ({ bounties }) => {

	// Hooks
	const [appState] = useContext(StoreContext);
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState(issueTitleSearchTerm);
	const [displayBounties, updateDisplayBounties] = useState([]);
	const [unfundedVisible, setUnfundedVisible] = useState(true);
	const [claimedVisible, setClaimedVisible] = useState('false');
	const [sortOrder, updateSortOrder] = useState('Newest');

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
		}
		else return 0;
	};

	const removeUnfunded = (bounties) => {
		return bounties.filter((elem) => {
			return elem.tvl.total > 0;
		});
	};

	const removeClaimed = (bounties) => {
		return bounties.filter((elem) => {
			return elem.status === 'OPEN';
		});
	};


	useEffect(() => {
		async function getTvls() {
			const newBounties = await bounties.map(async (elem, index) => {
				let tvl = await getTVL(elem.bountyTokenBalances);
				return { ...elem, tvl };
			});

			const resolvedTvls = await Promise.all(newBounties);
			updateDisplayBounties(removeUnfunded(removeClaimed(resolvedTvls)));
		}
		getTvls();
	}, [bounties]);

	// Methods
	const filterByIssueTitle = (e) => {
		setIssueTitleSearchTerm(e.target.value);
	};

	const orderBounties = (toggleTo, bounties = displayBounties) => {
		console.log(displayBounties);
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

	const showUnfunded = (e) => {
		setUnfundedVisible(e.target.checked);
		if (e.target.checked) {
			if (claimedVisible) {
				orderBounties(sortOrder, displayBounties);
			} else {
				orderBounties(sortOrder, removeClaimed(displayBounties));
			}
		} else {
			updateDisplayBounties(removeUnfunded(displayBounties));
		}
	};

	const showClaimed = (e) => {
		setClaimedVisible(e.target.checked);
		if (e.target.checked) {
			if (unfundedVisible) {
				orderBounties(sortOrder, displayBounties);
			} else {
				orderBounties(sortOrder, removeUnfunded(displayBounties));
			}
		} else {
			updateDisplayBounties(removeClaimed(displayBounties));
		}
	};

	// Render
	return (
		<div className="w-f space-y-3">
			<SearchBar
				onKeyUp={filterByIssueTitle}
				placeholder={"Search Issue..."}
			/>
			<div className="flex flex-wrap content-center items-center flex-row items-start gap-4">
				<div className="flex bg-dark-modegap-2  rounded-md border border-web-gray">
					<span className="text-white p-2  align-self-center pr-4">Sort By</span>
					<Dropdown toggleFunc={orderBounties} toggleVal={sortOrder} names={['Newest', 'Oldest', 'Highest\xa0TVL', 'Lowest\xa0TVL']} />
				</div>
				<div className="flex p-2 gap-2 border rounded-md border-web-gray">
					<label htmlFor="unfunded" className="text-white">Show Unfunded Bounties</label>
					<input id="unfunded" type="checkbox" className="accent-pink-500" onChange={showUnfunded} />
				</div>
				<div className="flex p-2 gap-2 border rounded-md border-web-gray">
					<label htmlFor="claimed" className="text-white" >Show Claimed Bounties</label>
					<input id="claimed" type="checkbox" className="accent-pink-500" onChange={showClaimed} />
				</div>
			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{displayBounties.length && displayBounties.length}
				{displayBounties.length == 1 ? ' Bounty found' : ' Bounties found'}
			</div>
			{displayBounties.length != 0
				? displayBounties.filter((bounty) => {
					return issueTitleSearchTerm
						? bounty.title
							.toLowerCase()
							.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
						: bounty;
				})
					.map((bounty) => {
						return <BountyCard bounty={bounty} key={bounty.bountyId} />;
					})
				: null}
		</div>
	);
};
export default BountyList;