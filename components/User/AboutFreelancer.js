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
import { BookIcon, EyeIcon, StarIcon } from '@primer/octicons-react';
import ProfilePicture from '../Layout/ProfilePicture';
import BountyMenu from '../Bounty/BountyMenu';
import BountyCardLean from '../Bounty/BountyCardLean';
import OrganizationCard from '../Organization/OrganizationCard';

const AboutFreelancer = ({ user, organizations, watchedBounties, starredOrganizations }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	console.log(starredOrganizations);
	const [internalMenu, setInternalMenu] = useState('Overview');
	const account = user.id;
	const [ensName] = useEns(account);
	// Context
	// State
	const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);
	useEffect(()=>{
		console.log(starredOrganizations);});
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
				
				<BountyMenu internalMenu={internalMenu} updatePage={setInternalMenu} styles="border-transparent" colour="rust"  items={[{name: 'Overview', Svg: BookIcon}, {name: 'Stars', Svg: StarIcon}, {name:'Watching', Svg: EyeIcon}]}/>
				<div className='flex flex-col pt-4 px-4'>
					{internalMenu == 'Overview' ?
						(<div className='w-full'>
							<AboutTitle ensName={ensName} account={account} />

							{watchedBounties.length > 0 &&
								<div className=' py-6 border-t border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
									<h3>Watched Issues</h3>
									<Carousel>

										{watchedBounties.map((watchedBounty, index) => <CarouselBounty key={index} bounty={watchedBounty} />)}


									</Carousel>
								</div>
							}
							<UserHistory organizations={organizations} payouts={payouts} />
							<Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} type="Total Payouts" />
							<MiniBountyList bounties={bountiesClosed} />
						</div>)
						: internalMenu == 'Stars' ?
							(<div className='w-full'>
								{watchedBounties.length > 0 &&
									<div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
										{starredOrganizations.map((bounty, index)=>
											<OrganizationCard key={index} organization={bounty}/>)}
									</div>
								}
							</div>)
							:
							(<div className='w-full'>
								{watchedBounties.length > 0 &&
									<div className='py-6 border-border-gray flex flex-wrap items-stretch w-full font-semibold text-lg'>
										{watchedBounties.map((bounty, index)=>
											<BountyCardLean key={index} bounty={bounty}/>)}
									</div>
								}
							</div>)
					}

				</div>
			</div>
		</div>
	</>
	);
};

export default AboutFreelancer;