// Third party
import React, { useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';

// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useEns from '../../hooks/useENS';
import AboutTitle from './AboutModules/AboutTitle';
import UserHistory from './AboutModules/UserHistory';
import Balances from './AboutModules/Balances';
import CarouselBounty from '../Bounty/CarouselBounty';
import Carousel from '../Utils/Carousel';
import MiniBountyList from './AboutModules/MiniBountyList';

const AboutUser = ({ user, organizations, watchedBounties }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const account = user.id;
	const [ensName] = useEns(account);
	// Context
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
		<AboutTitle ensName= {ensName} account = {account}/>
	
		{watchedBounties.length>0 &&
		<div className='px-16 py-6 py-6 border-b border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
			<h3>Watched Bounties</h3>
			<Carousel>

				{ watchedBounties.map((watchedBounty, index)=><CarouselBounty key={index} bounty={watchedBounty}/>)}
			
			
			</Carousel>
		</div>
		}		
		<UserHistory organizations = {organizations} payouts ={payouts} />
		<Balances tokenBalances={payoutTokenBalances} tokenValues = {payoutTokenValues} type="Total Payouts"  />
		<MiniBountyList bounties={ bountiesClosed } />
	</>
	);
};

export default AboutUser;