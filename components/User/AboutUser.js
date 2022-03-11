// Third Party
import React, { useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
// Custom
import DepositCard from './DepositCard';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import jazzicon from '@metamask/jazzicon';

const UserContracts = ({user,})=>{
	console.log(user);
	const {fundedTokenBalances, bountiesCreated, bountiesClosed, deposits}= user;
	console.log(user);
	const account= user.id;
    
	// State
	const [tokenValues] = useGetTokenValues(fundedTokenBalances);

	const iconWrapper = useRef(null);
	
	useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [ ]);
	return(<>
		<h1 className='font-semibold p-4 text-3xl border-web-gray border-b flex gap-2 mb-5'><span ref={iconWrapper}></span><span className='leading-none'>{account}</span></h1>
		
		<div className='px-16 py-5 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl'>Total Contributions</h2>
		
			<TokenBalances 
				tokenBalances={fundedTokenBalances}
				tokenValues={tokenValues} />
		</div>
		<div className='px-16 py-10 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl'>Bounties Claimed</h2>
			<div className='pt-1'>
				{bountiesClosed.length != 0 ? <ul>{ bountiesClosed.map(bounty => {
					return (
						<li key={bounty.id} className="text-lg underline py-2">
							<Link href={`/bounty/${bounty.bountyAddress}`}>{`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyAddress}`}</Link>
						</li>
					);
				})
				}</ul> : 'No Bounties Claimed'}
			</div>
		</div>
		<div className='px-16 py-10 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl'>Bounties Minted</h2>
			<div>
				{bountiesCreated.length != 0 ? <ul>{ bountiesCreated.map(bounty => {
					return (
						<li key={bounty.id} className="text-lg underline py-2">
							<Link href={`/bounty/${bounty.bountyAddress}`}>{`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyAddress}`}</Link>
						</li>
					);
				})
				}</ul> : 'No Bounties Created'}</div>
			
		</div>
		<div className='px-16 py-5 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase mt-5 text-gray-300 text-xl '>Deposits</h2>
			<div>	{deposits.map((deposit)=> {return  <DepositCard key={deposit.id} deposit={deposit}/>;})}</div>
			
		</div>
		
	</>
	);
};

export default UserContracts;