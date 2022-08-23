import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LabelsList from './LabelsList';
import CopyBountyAddress from './CopyBountyAddress';
import StoreContext from '../../store/Store/StoreContext';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const BountyMetadata = ({ bounty, setInternalMenu, price, budget, split}) => {
	const [appState] = useContext(StoreContext);
	const tokenBalances = bounty.payoutTokenVolume ? { tokenAddress: bounty.payoutTokenAddress, volume: bounty.payoutTokenVolume } : null;
	const [tokenValues] = useGetTokenValues(tokenBalances);

	let type = 'Atomic Contract';

	switch (bounty.bountyType) {
	case '1':
		type = 'Repeating Contract';
		break;
	case '2':
		type = 'Contest Contract';
		break;
	case '3':
		type = 'Atomic Contract';
		break;

	}
	return (

		<ul className='md:max-w-[300px] w-full md:pl-4'>
			<li className='border-b border-web-gray py-3'>
				<div className='text-xs font-semibold text-muted'>Type</div>
				<div className='text-xs font-semibold text-primary leading-loose' >{type}</div>
			</li>
			{(split || split === 0) &&
				<li className='border-b border-web-gray py-3'>
					<>
						<div className='text-xs font-semibold text-muted'>Payout Amount</div>
						<button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Claim')}>
							<TokenBalances
								lean={true}
								tokenBalances={tokenBalances}
								tokenValues={tokenValues}
								singleCurrency={true}
								small={true}
							/></button>
					</>
				</li>
			}
			{price || (price === 0 && bounty) ? <li className='border-b border-web-gray py-3'>
				{(price || price === 0) &&
					<>
						<div className='text-xs font-semibold text-muted'>TVL</div>
						<button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Fund')}>{appState.utils.formatter.format(
							price
						)}</button>
					</>}
			</li> :
				null
			}
			{(budget !== 0) && <li className='border-b border-web-gray py-3'>
				{(budget || budget === 0) &&
					<>
						<div className='text-xs font-semibold text-muted'>Current target budget</div>
						<button className='text-xs font-semibold text-primary' onClick={() => setInternalMenu('Fund')}>{appState.utils.formatter.format(
							budget
						)}</button>
					</>}
			</li>}
			{bounty.assignees.length > 0 && <li className='border-b border-web-gray py-3'>
				<div className='text-xs font-semibold text-muted'>Assignees</div>

				{bounty.assignees.map((assignee, index) => {
					return <div key={index} className='flex gap-2 py-3'><Image className='rounded-lg inline-block py-4' height={24} width={24} src={assignee.avatarUrl} />
						<div className='inline-block text-xs pt-1 font-semibold'>{assignee.name}</div>

					</div>;
				})}
			</li>}
			{bounty.labels &&
				<li className='border-b border-web-gray py-3'>
					<div className='text-xs font-semibold text-muted'>Labels</div>
					{bounty.labels.length > 0 ? <LabelsList bounty={bounty} /> :
						<span className='text-sm'>No labels</span>
					}
				</li>}
			<li className='border-b border-web-gray py-3 text sm'><Link href={`https://polygonscan.com/address/${bounty.bountyAddress}`}>
				<div className='text-xs font-semibold  cursor-pointer text-muted'>Polygonscan</div>
			</Link>
			{bounty.bountyAddress &&

					<CopyBountyAddress styles="text-sm pt-2" address={bounty.bountyAddress} />
			}
			</li>
			<li className='border-b border-web-gray py-3'>
				{bounty?.prs?.some(pr => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0 ? <ul>

					<div className='text-xs font-semibold text-muted'>Linked Pull Requests</div>
					{bounty.prs.filter((pr) => {
						return pr.source['__typename'] === 'PullRequest' && pr.source.url;
					}).map((pr, index) => {
						if (pr.source['__typename'] === 'PullRequest' && pr.source.url) {
							return <li className='text-sm text-primary' key={index}>
								<Link href={pr.source.url}>
									<a target="_blank" className={'underline'}>
										{pr.source.title}
									</a>
								</Link>
								<span>
									{pr.source.merged ? ' (merged)' : ' (not merged)'}</span>
							</li>;
						}
					})}
				</ul> : <span className='text-xs font-semnibold text-muted'>No linked pull requests</span>}
			</li>

		</ul>
	);
};
export default BountyMetadata;