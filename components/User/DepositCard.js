// Third Party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';


import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
const DepositCard = ({ deposit }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [, updateTitle] = useState('');
	const [tokenValues] = useGetTokenValues(deposit);
	useEffect(async()=>{
		const fetchedTitle = await appState.githubRepository.fetchIssueById(deposit.bounty.bountyId);
		updateTitle(fetchedTitle.title);
	});
	const timeToExpiry = parseInt(deposit.receiveTime) + parseInt(deposit.expiration)*1000 - Date.now();

	

	return (
		<Link href={`/bounty/${deposit.bounty.id}`}>
			<div key={deposit.id} className={`bg-web-gray/20 ${(open) ? timeToExpiry < 604800 ? 'border-red-500' : timeToExpiry < 1209600 ? 'border-yellow-500' : 'border-green-500' : 'border-web-gray'} border px-8 my-4 pb-4 rounded-md max-w-sm`}>
				<TokenBalances
					tokenBalances={[deposit]}
					tokenValues={tokenValues}
					singleCurrency={false}
				/>
				{(open) && <div key={deposit.id} className='text-white'>Locked until: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}</div>
				}
			</div></Link>
		
	);
};

export default DepositCard;
