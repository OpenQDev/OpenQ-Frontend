// Third party
import React, { useEffect, useRef, useState } from 'react';
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
import SubMenu from '../Utils/SubMenu';
import { BookIcon, EyeIcon, StarIcon } from '@primer/octicons-react';

const AboutFreelancer = ({ user, organizations, watchedBounties }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const [internalMenu, setInternalMenu] = useState("Overview");
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

		<div className="flex justify-center border-b border-border-gray">
			<SubMenu
				names={[["Overview", <div ><BookIcon size={16} className='mr-1'/> Overview</div>], ["Stars", <div><StarIcon size={16} className='mr-1'/> Stars</div>], ["Watching", <div><EyeIcon size={16} className='mr-1'/> Watching</div>]]}
				toggleFunc={setInternalMenu}
				toggleVal={internalMenu}
			/>
		</div>
		{internalMenu == "Overview" ?
			(<>
				<AboutTitle ensName={ensName} account={account} />

				{watchedBounties.length > 0 &&
					<div className='px-16 py-6 py-6 border-b border-web-gray flex flex-wrap items-stretch w-full font-semibold text-gray-300 text-lg'>
						<h3>Watched Bounties</h3>
						<Carousel>

							{watchedBounties.map((watchedBounty, index) => <CarouselBounty key={index} bounty={watchedBounty} />)}


						</Carousel>
					</div>
				}
				<UserHistory organizations={organizations} payouts={payouts} />
				<Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} type="Total Payouts" />
				<MiniBountyList bounties={bountiesClosed} />
			</>)
			: null
		}


	</>
	);
};

export default AboutFreelancer;