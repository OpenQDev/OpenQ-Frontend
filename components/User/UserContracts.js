// Third Party
import React, { useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import jazzicon from '@metamask/jazzicon';

const UserContracts = ({fundedTokenBalances, account})=>{
	console.log(fundedTokenBalances);

    
	// State
	const [tokenValues] = useGetTokenValues(fundedTokenBalances);

	const iconWrapper = useRef(null);
	
	useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(24, parseInt(account.slice(2, 10), 16)));
		}
	}, [ ]);
	return(<>
		<h1 className='font-semibold p-4 text-3xl border-web-gray border-b'><span ref={iconWrapper}></span><span>{account}</span></h1>
		<h1 className='font-bold uppercase'>Total Contributions</h1>
		{fundedTokenBalances.map(tokenBalance => {
			const tokenAddress = ethers.utils.getAddress(tokenBalance.tokenAddress);
			return (
				<div key={tokenAddress}>
					<div>Contract Address: {tokenAddress}</div>
					<TokenBalances 
						tokenBalances={fundedTokenBalances}
						tokenValues={tokenValues} />
				</div>
			);
		})}</>
	);
};

export default UserContracts;