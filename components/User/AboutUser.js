// Third Party
import React, { useState, useEffect, useRef, useContext } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import MiniBountyCard from './MiniBountyCard';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import MiniDepositCard from './MiniDepositCard';
import AvatarPack from './AvatarPack';
import StoreContext from '../../store/Store/StoreContext';

const UserContracts = ({user})=>{
	const {fundedTokenBalances, bountiesCreated, bountiesClosed, deposits, payoutTokenBalances, payouts}= user;
	const account= user.id;
	// Context
	const [appClient] = useContext(StoreContext);
    
	// State
	const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);
	const [fundedTokenValues] = useGetTokenValues(fundedTokenBalances);

	const [organizations, updateOrganizations] = useState([]);
	

	const iconWrapper = useRef(null);
	
	useEffect(async() => {
		const issueIds = bountiesClosed.map(bounty=>bounty.bountyId);
		const fetchedOrganizations = await appClient.githubRepository.parseOrgIssues(issueIds);
		updateOrganizations(fetchedOrganizations);


		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [bountiesClosed]);
	return(<>
		<h1 className='font-semibold p-4 text-3xl border-web-gray border-b flex gap-2'>
			<span className='pt-2' ref={iconWrapper}></span>
			<span className='leading-none'>
				<CopyAddressToClipboard data={account} clipping={[5,39]}/>
			</span>
		</h1>
		<div className='px-16 py-6 py-6 gap-6 border-b border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
			{organizations&&
				<div className='flex-1 mb-6'>
					<div className='pb-2'>Organizations</div>
					<AvatarPack avatars={organizations} />
				</div>}
			<div className='flex-1 whitespace-nowrap'>
				<div className='pb-2'>Bounties Collected</div>
			
				<div className='text-white text-base leading-[32px]'>{payouts.length}</div>
			</div>
		</div>
		<div className='px-16 py-5 pb border-b border-web-gray'>
			{fundedTokenBalances.length > 0&&
				<div className='py-5 border-web-gray'>
					<h2 className='font-bold uppercase text-gray-300 text-xl'>Total Contributions</h2>
					<TokenBalances
						tokenBalances={fundedTokenBalances}
						tokenValues={fundedTokenValues} />
				</div>}	
		</div>
		{payoutTokenBalances.length>0&&<div className='px-16 py-5 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl'>Total Payouts</h2>
			<TokenBalances 
				tokenBalances={payoutTokenBalances}
				tokenValues={payoutTokenValues} />
		</div>}
		<div className='px-10 py-10 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Bounties Claimed</h2>
			<div>
				{bountiesClosed.length != 0 ? 
					<ul>{ bountiesClosed.map((bounty, index) => {
				
						return (
							<MiniBountyCard key={index} bounty={bounty}/>
						);
					})
					}</ul> :
					<span className='px-6 pt-2'>No Bounties Claimed</span>}
			</div>
		</div>
		<div className='p-10 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Bounties Minted</h2>
			<div className="pt-2">
				{bountiesCreated.length != 0 ? 
					<ul>{ bountiesCreated.map((bounty, index) => {
				
						return (
							<MiniBountyCard key={index} bounty={bounty}/>
						);
					})
					}</ul>:
					<span className='px-6 pt-2'>No Bounties Created</span>}
			</div>
			
		</div>
		<div className='px-10 py-5 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Deposits</h2>
			
			{deposits.length > 0 ?
				<ul className="flex flex-wrap justify-between gap-5 pt-2">{deposits.map((deposit)=> 
					<MiniDepositCard key={deposit.id} showLink={true} deposit={deposit}/>
				)}</ul>:
			
				<div className='px-6 pt-2'>No Deposits</div>}
			
		</div>
		
	</>
	);
};

export default UserContracts;