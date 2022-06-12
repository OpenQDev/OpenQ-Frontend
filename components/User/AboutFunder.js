// Third party
import React, { useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import MiniBountyCard from '../Bounty/MiniBountyCard';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import useEns from '../../hooks/useENS';
import DepositCard from '../RefundBounty/DepositCard';

const AboutFunder = ({ user,  }) => {
	const { fundedTokenBalances, bountiesCreated, bountiesClosed, deposits } = user;
	const account = user.id;
	const [ensName] = useEns(account);
	// Context

	// State
	const [fundedTokenValues] = useGetTokenValues(fundedTokenBalances);


	const iconWrapper = useRef(null);

	useEffect(async () => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [bountiesClosed]);
	return (<>
		<h1 className='font-semibold p-4 text-2xl border-web-gray border-b flex gap-2'>
			<span className='pt-2' ref={iconWrapper}></span>
			<span className='leading-none'>
				<span>{ensName}</span>
				<CopyAddressToClipboard data={account} noClip={ensName < 15} clipping={[5, 39]} />
			</span>
		</h1>
		<div className='px-10 py-10 border-web-gray border-b'>
			<h2 className='font-bold uppercase text-gray-300 text-xl pb-4 px-6'>Deposits</h2>

			{deposits.length > 0 ?
				<ul className="flex flex-wrap justify-between gap-5 pt-2">{deposits.map((deposit) =>
					<DepositCard key={deposit.id} showLink={true} deposit={deposit} />
				)}</ul> :

				<div className='px-6 pt-2'>No Deposits</div>}
		</div>
		{fundedTokenBalances.length > 0 &&
		<div className='px-16 py-5 pb border-b border-web-gray'>
			<div className='py-5 border-web-gray'>
				<h2 className='font-bold uppercase text-gray-300 text-xl'>Total Contributions</h2>
				<TokenBalances
					tokenBalances={fundedTokenBalances}
					tokenValues={fundedTokenValues} />
			</div>
		</div>}
		<div className='p-10 pb'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Bounties Minted</h2>
			<div className="pt-2">
				{bountiesCreated.length != 0 ?
					<ul>{bountiesCreated.map((bounty, index) => {

						return (
							<MiniBountyCard key={index} bounty={bounty} />
						);
					})
					}</ul> :
					<span className='px-6 pt-2'>No Bounties Created</span>}
			</div>

		</div>

	</>
	);
};

export default AboutFunder;