// Third party
import React, { useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import MiniBountyCard from '../Bounty/MiniBountyCard';
import TokenBalances from '../TokenBalances/TokenBalances';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import AvatarPack from '../Utils/AvatarPack';
import useEns from '../../hooks/useENS';
import CarouselBounty from '../Bounty/CarouselBounty';
import Carousel from '../Utils/Carousel';

const AboutUser = ({ user, organizations, watchedBounties }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const account = user.id;
	const [ensName] = useEns(account);
	// Context
	console.log(watchedBounties);
	// State
	const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);

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
	
		{watchedBounties.length>0 &&
		<div className='px-16 py-6 py-6 border-b border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
			<h3>Watched Bounties</h3>
			<Carousel>

				{ watchedBounties.map((watchedBounty, index)=><CarouselBounty key={index} bounty={watchedBounty}/>)}
			
			
			</Carousel>
		</div>
		}

		<div className='px-16 py-6 py-6 gap-6 border-b border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
			{organizations &&
				<div className='flex-1 mb-6'>
					<div className='pb-2'>Organizations</div>					
					{organizations.length===0 ?
						<div className='font-normal flex-1'>User hasn{'\''}t claimed  a bounty with any organization.</div>:
						<AvatarPack avatars={organizations} />}
				</div> }
			<div className='flex-1 whitespace-nowrap'>
				<div className='pb-2'>Bounties Collected</div>

				<div className=' text-base leading-[32px]'>{payouts.length}</div>
			</div>
		</div>
		{payoutTokenBalances.length > 0 && <div className='px-16 py-5 pb border-b border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl'>Total Payouts</h2>
			<TokenBalances
				tokenBalances={payoutTokenBalances}
				tokenValues={payoutTokenValues} />
		</div>}
		<div className='px-10 py-10 pb border-web-gray'>
			<h2 className='font-bold uppercase text-gray-300 text-xl px-6'>Bounties Claimed</h2>
			<div>
				{bountiesClosed.length != 0 ?
					<ul>{bountiesClosed.map((bounty, index) => {

						return (
							<MiniBountyCard key={index} bounty={bounty} />
						);
					})
					}</ul> :
					<span className='px-6 pt-2'>No Bounties Claimed</span>}
			</div>
		</div>
		

	</>
	);
};

export default AboutUser;