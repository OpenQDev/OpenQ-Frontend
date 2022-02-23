import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Toggle from '../Toggle/Toggle';

const BountyList = ({bounties})=>{

	// Hooks

	const [appState]=useContext(StoreContext);
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState(issueTitleSearchTerm);
	const [displayBounties, updateDisplayBounties ] =useState([]);
	const [showUnfunded, updateShowUnfunded]=useState('hide empty bounties');
	const [sortOrder, updateSortOrder] = useState('newest');
	const [tvlBounties, updateTvlBounties]=useState([]);
    
	// Add TVL ( similar to useGetTokenValues hook )

	const getTVL=async(tokenBalances)=>{
		let tokenVolumes = {};
		tokenBalances.map((tokenBalance) => {
			const tokenAddress = appState.tokenMetadata[ethers.utils.getAddress(tokenBalance.tokenAddress)].address;
			tokenVolumes[tokenAddress] = tokenBalance.volume;
		});

		const data = { tokenVolumes };
		const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
		//only query tvl for bounties that have deposits
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

	useEffect(async() => {
		const newBounties=await bounties.map(async(elem,index)=>{

			const tvl = (index===1)?await getTVL(elem.bountyTokenBalances):{total:0};
			return  {...elem, tvl};
		});
		const resolvedTvls= await Promise.all(newBounties);
		updateTvlBounties(resolvedTvls);
		updateDisplayBounties(resolvedTvls.filter((elem)=>{
			return elem.tvl.total>0;
		}));
	},[]);

	// Methods

	function filterByIssueTitle(e){
		setIssueTitleSearchTerm(e.target.value);

	}
	
	function orderBountiesByAge(toggleTo, bounties=displayBounties){
		if(toggleTo==='oldest'){            
			updateDisplayBounties(bounties.sort((a, b)=>{
				return a.bountyMintTime-b.bountyMintTime;
			}));
			updateSortOrder('oldest');
		}
			
		else{
			updateDisplayBounties(bounties.sort((a, b)=>{
				return b.bountyMintTime-a.bountyMintTime;
			}));
			updateSortOrder('newest');

		}
	}

	async function orderBountiesByPrice(toggleTo, bounties=displayBounties){
		if(toggleTo==='highest\xa0TVL'){			
			updateDisplayBounties(bounties.sort((a, b)=>{
				return b.tvl.total-a.tvl.total;
			}));
			updateSortOrder('highest\xa0TVL');

		}
		else{
			updateDisplayBounties(bounties.sort((a, b)=>{				
				return a.tvl.total-b.tvl.total;
			}));
			updateSortOrder('lowest\xa0TVL');
		}
	}

	async function viewUnfundedBounties (toggleTo){
		if(toggleTo==='view empty bounties'){
			if(sortOrder ==='oldest'||sortOrder==='newest'){
				orderBountiesByAge(sortOrder, tvlBounties);
			}
			else if(sortOrder==='highest\xa0TVL'|| sortOrder ==='lowest\xa0TVL'){
				orderBountiesByPrice(sortOrder, tvlBounties);
			}
			else{ updateDisplayBounties(tvlBounties);}
		}
		else{
			updateDisplayBounties(displayBounties.filter((elem)=>{
				return elem.tvl.total>0;
			}));
		}
		updateShowUnfunded(toggleTo);
	}

	// Render
    
	return(
		<div className="w-f space-y-3">
			<input
				className="outline-none w-full font-mont rounded-lg py-2 p-5 pb-1 border border-web-gray bg-dark-mode text-white"
				onKeyUp={(e) => filterByIssueTitle(e)}
				type="text"
				placeholder="Search Issue..."
			></input>
			<div className="flex flex-wrap content-start items-start md:items-center md:content-center flex-col md:flex-row items-start gap-4">
				<span className="text-white align-self-center pr-4">Filter By</span>
				<Toggle toggleFunc={orderBountiesByAge} toggleVal={sortOrder} names={['newest', 'oldest']}/>
				<Toggle toggleFunc={orderBountiesByPrice} toggleVal={sortOrder} names={['highest\xa0TVL', 'lowest\xa0TVL']}/>
				<Toggle toggleFunc={viewUnfundedBounties} toggleVal={showUnfunded} names={['hide empty bounties','view empty bounties']}/>

			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{bounties.length}
				{bounties.length < 2 ? ' Bounty found' : ' Bounties found'}
			</div>
			{displayBounties.length != 0
				? displayBounties
					.filter((bounty) => {
						return issueTitleSearchTerm
							? bounty.title
								.toLowerCase()
								.indexOf(issueTitleSearchTerm.toLowerCase()) > -1
							: bounty;
					})
					.map((bounty) => {
						return <BountyCard bounty={bounty} key={bounty.bountyId} />;
					})
				: 'No Bounties'}
		</div>
	);
};
export default BountyList;