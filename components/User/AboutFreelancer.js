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
import ProfilePicture from '../Layout/ProfilePicture';

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

		<div className='px-4 sm:px-8 text-primary border-border-gray border-b w-full flex h-12 gap-x-8 relative'>
			<div className="flex">
				<ProfilePicture contributor={true} styles={'pt-40'} />
			</div>
			<div className='flex flex-col w-5/7'>
				<SubMenu
					names={[["Overview", <div className='p-1'><BookIcon size={16} className='mr-1' /> Overview</div>], ["Stars", <div className='p-1'><StarIcon size={16} className='mr-1' /> Stars</div>], ["Watching", <div className='p-1'><EyeIcon size={16} className='mr-1' /> Watching</div>]]}
					toggleFunc={setInternalMenu}
					toggleVal={internalMenu}
					contributor={true}
				/>
				<div className='flex flex-col pt-4 px-4'>
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
						: internalMenu == "Stars" ?
							(<>
								Followed organizations
							</>)
							:
							(<>
								Issues the user follows
								<br />
								Filtering to check which issued are closed or open
							</>)
					}

				</div>
			</div>
		</div>
	</>
	);
};

export default AboutFreelancer;