
// Third party
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TokenBalances from '../TokenBalances/TokenBalances';
const MiniDepositCard = ({ deposit, showLink, status }) => {
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [title, updateTitle] = useState('');
	const [tokenValues] = useGetTokenValues(deposit);

	// Hooks
	useEffect(async () => {
		if (showLink) {
			try {
				const fetchedTitle = await appState.githubRepository.fetchIssueById(deposit.bounty.bountyId);
				updateTitle(fetchedTitle.title);
			}
			catch (error) {
				console.log(error);
			}
		}
	});
	const timeToExpiry = parseInt(deposit.receiveTime) + parseInt(deposit.expiration) - Date.now() * 0.001;
	const open = !deposit.refunded && (status === 'OPEN' || deposit.bounty?.status === 'OPEN');

	// render
	return (
		<div key={deposit.id} className={`bg-web-gray/20 ${(open && deposit) ? timeToExpiry < 604800 ? 'border-red-500' : timeToExpiry < 1209600 ? 'border-yellow-500' : 'border-green' : 'border-web-gray'} border px-4 py-4 pb-4 h-min rounded-md sm:w-64 max-w-[280px]  lg:col-span-2 justify-self-center`}>
			{showLink && <Link href={`/bounty/${deposit.bounty.bountyId}/${deposit.bounty.id}`}>
				<h3 className='text-xl font-semibold leading-none underline cursor-pointer pb-2'>{title}</h3>
			</Link>}
			<TokenBalances
				tokenBalances={[deposit]}
				tokenValues={tokenValues}
				singleCurrency={false}
			/>
			{deposit ?
				(deposit.refunded) ? <div>Refunded</div> : (!open) ?
					<div>Claimed</div>
					: (timeToExpiry > 0)? <div key={deposit.id}>Locked until: {appState.utils.formatUnixDate(parseInt(deposit.receiveTime) + parseInt(deposit.expiration))}</div>:
						<div key={deposit.id}>Locked expired. This deposit can be refunded at any time.</div>
				: <Skeleton count={2} />
			}
		</div>
	);
};

export default MiniDepositCard;