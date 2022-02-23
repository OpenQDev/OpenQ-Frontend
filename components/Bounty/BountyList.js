// Third Party
import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
//Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCard from './BountyCard';
import Dropdown from '../Toggle/Dropdown';

const BountyList = ({bounties})=>{

	// Hooks
	
	const [appState]=useContext(StoreContext);
	const [issueTitleSearchTerm, setIssueTitleSearchTerm] = useState(issueTitleSearchTerm);
	const [displayBounties, updateDisplayBounties ] =useState([]);
	const [unfundedVisible, setUnfundedVisible]=useState(true);
	const [claimedVisible, setClaimedVisible]=useState('false');
	const [sortOrder, updateSortOrder] = useState('newest');
	const [tvlBounties, updateTvlBounties]=useState([]);
    
	// Utilities

	const getTVL=async(tokenBalances)=>{
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

	function removeUnfunded(bounties){
		return bounties.filter((elem)=>{
			return elem.tvl.total>0;
		});

	}

	function removeClaimed(bounties){
		return bounties.filter((elem)=>{
			return elem.status==='OPEN';

		});
	} 

	useEffect(async() => {
		const newBounties=await bounties.map(async(elem,index)=>{

			const tvl = (index===1)?await getTVL(elem.bountyTokenBalances):{total:0};
			return  {...elem, tvl};
		});
		const resolvedTvls= await Promise.all(newBounties);
		updateTvlBounties(resolvedTvls);
		updateDisplayBounties(removeUnfunded(removeClaimed(resolvedTvls)));
	},[bounties]);
	

	// Methods

	function filterByIssueTitle(e){
		setIssueTitleSearchTerm(e.target.value);

	}
	
	function orderBounties(toggleTo, bounties=displayBounties){
		switch(toggleTo){
		case 'highest\xa0TVL':			
			updateDisplayBounties(bounties.sort((a, b)=>{
				return b.tvl.total-a.tvl.total;
			}));
			updateSortOrder('highest\xa0TVL');
			
			break;
		case 'lowest\xa0TVL':
			updateDisplayBounties(bounties.sort((a, b)=>{				
				return a.tvl.total-b.tvl.total;
			}));
			break;
		case 'newest':
			updateDisplayBounties(bounties.sort((a, b)=>{
				return b.bountyMintTime-a.bountyMintTime;
			}));
			break;
		case 'oldest':			           
			updateDisplayBounties(bounties.sort((a, b)=>{
				return a.bountyMintTime-b.bountyMintTime;
			}));
			break;
		}
		updateSortOrder(toggleTo);
	}
	
	function showUnfunded(e){		
		setUnfundedVisible(e.target.checked);
		if(e.target.checked){
			if(claimedVisible){				
				orderBounties(sortOrder, tvlBounties);
			}
			else {
				orderBounties(sortOrder, removeClaimed(tvlBounties));
			}

		}
		else {
			updateDisplayBounties(removeUnfunded(displayBounties));
		}
		
	}

	function showClaimed(e){		
		setClaimedVisible(e.target.checked);
		if(e.target.checked){
			if(unfundedVisible){				
				orderBounties(sortOrder, tvlBounties);
			}
			else {
				orderBounties(sortOrder, removeUnfunded(tvlBounties));
			}

		}
		else {
			updateDisplayBounties(removeClaimed(displayBounties));
		}
		
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
			<div className="flex flex-wrap content-center items-center flex-row items-start gap-4">
				
				<div className="flex bg-dark-modegap-2  rounded-md border border-web-gray">
					<span className="text-white p-2  align-self-center pr-4">Sort By</span>
					<Dropdown toggleFunc={orderBounties} toggleVal={sortOrder} names={['newest', 'oldest','highest\xa0TVL', 'lowest\xa0TVL']}/>
				</div>
				<div className="flex p-2 gap-2 border rounded-md border-web-gray">
					<label htmlFor="unfunded" className="text-white">Show unfunded bounties</label>
					<input id="unfunded" type="checkbox" className="accent-pink-500" onChange={showUnfunded} />
				</div>
				<div className="flex p-2 gap-2 border rounded-md border-web-gray">
					<label htmlFor="claimed" className="text-white" >Show claimed bounties</label>
					<input id="claimed" type="checkbox" className="accent-pink-500" onChange={showClaimed} />
				</div>
			</div>
			<div className="text-gray-300 font-mont pt-1 font-normal">
				{displayBounties.length&&displayBounties.length}
				{displayBounties.length < 2 && displayBounties.length > 0  ?  ' Bounty found' : ' Bounties found'}
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
				: null}
		</div>
	);
};
export default BountyList;