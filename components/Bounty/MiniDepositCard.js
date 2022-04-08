
// Third Party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
const MiniDepositCard = ({deposit, showLink})=>{
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [title, updateTitle] = useState('');
	const [tokenValues] = useGetTokenValues(deposit);

	// Hooks
	useEffect(async()=>{
		if(showLink){
			try{
				const fetchedTitle = await appState.githubRepository.fetchIssueById(deposit.bounty.bountyId);
				updateTitle(fetchedTitle.title);
			}
			catch(error){
				console.log(error);
			}
		}
	});

	const timeToExpiry = parseInt(deposit.receiveTime) + parseInt(deposit.expiration) - Date.now()* 0.001 ;
	const open = !deposit.refunded&&!deposit.claimed;

	// render
	return(
		<div key={deposit.id} className={`bg-web-gray/20 ${(open&&deposit) ? timeToExpiry < 604800 ? 'border-red-500' : timeToExpiry < 1209600 ? 'border-yellow-500' : 'border-green' : 'border-web-gray'} border px-8 py-4 my-4 pb-4 h-min rounded-md sm:w-72 text-white`}>		
			{showLink&&<Link href={`/bounty/${deposit.bounty.id}`}>
				<h3 className='text-xl font-semibold leading-none underline cursor-pointer pb-2'>{title}</h3>			
			</Link>}
			<TokenBalances
				tokenBalances={[deposit]}
				tokenValues={tokenValues}
				singleCurrency={false}
			/>
			{deposit?
				(deposit.refunded)?<div>Refunded</div>: (deposit.claimed)?
					<div>Claimed</div>
					: <div key={deposit.id}>Locked until: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}</div>
				: <Skeleton count={2}/>
			}
		</div>
	);
};

export default MiniDepositCard;