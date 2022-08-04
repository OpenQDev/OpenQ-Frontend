// Third party
import React, { useEffect, useRef, useState } from 'react';
import jazzicon from '@metamask/jazzicon';

// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useEns from '../../hooks/useENS';
import AboutTitle from './AboutModules/AboutTitle';
import UserHistory from './AboutModules/UserHistory';
import Balances from './AboutModules/Balances';
import MiniBountyList from './AboutModules/MiniBountyList';
import { BookIcon, EyeIcon, StarIcon } from '@primer/octicons-react';
import ProfilePicture from '../Layout/ProfilePicture';
import SubMenu from '../Utils/SubMenu';
import Watching from './AboutModules/Watching';
import Starred from './AboutModules/Starred';

const AboutFreelancer = ({ user, organizations, watchedBounties, starredOrganizations }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const [internalMenu, setInternalMenu] = useState('Overview');
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

		<div className='text-primary w-full flex gap-x-8 relative'>
			<div className="flex hidden">
				<ProfilePicture contributor={true} styles={'pt-40'} />
			</div>
			<div className='flex flex-col w-full'>
				
				<SubMenu internalMenu={internalMenu} updatePage={setInternalMenu} styles="sm:mx-auto sm:w-3/4 max-w-[960px] border-none justify-center sm:justify-start" colour="rust"  items={[{name: 'Overview', Svg: BookIcon}, {name: 'Stars', Svg: StarIcon}, {name:'Watching', Svg: EyeIcon}]}/>
				<div className='flex flex-col sm:px-20 px-4 border-t border-web-gray'>
					{internalMenu == 'Overview' ?
						(<div className='w-full  max-w-[1240px] mx-auto'>
							<AboutTitle ensName={ensName} account={account} />

							<UserHistory organizations={organizations} payouts={payouts} />
							<Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} type="Total Payouts" />
							<MiniBountyList bounties={bountiesClosed} />
						</div>)
						: internalMenu == 'Stars' ?
							<Starred starredOrganizations={starredOrganizations} />
							:
							watchedBounties &&	<Watching watchedBounties={watchedBounties} />
					}

				</div>
			</div>
		</div>
	</>
	);
};

export default AboutFreelancer;