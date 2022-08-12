// Third party
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import StoreContext from '../../store/Store/StoreContext';

const AboutFreelancer = ({ user, organizations, starredOrganizations, showWatched }) => {
	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const [internalMenu, setInternalMenu] = useState('Overview');
	const [appState] = useContext(StoreContext);
	const[watchedBounties, setWatchedBounties] = useState([]);
	const account = user.id;
	const [ensName] = useEns(account);
	// Context
	// State
	const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);
	const iconWrapper = useRef(null);

	
	useEffect(async () => {
		if (account && showWatched) {
			// get watched bounties as soon as we know what the account is.
			try {
				const prismaBounties = await appState.openQPrismaClient.getUser(
					account
				);
				const watchedBountyAddresses = prismaBounties?.watchedBountyIds.map(
					(address) => address.toLowerCase()
				)||[];
				const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(watchedBountyAddresses, ['0', '1','2']);
				const githubIds = subgraphBounties.map((bounty) => bounty.bountyId);
				const githubBounties = await appState.githubRepository.getIssueData(
					githubIds
				);
				setWatchedBounties(
					subgraphBounties.map((bounty, index) => {
						return { ...bounty, ...githubBounties[index] };
					})
				);
			} catch (err) {
				console.log(err);
			}
		}
	}, [account, showWatched]);

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
				
				<SubMenu internalMenu={internalMenu} updatePage={setInternalMenu} styles="sm:mx-auto sm:w-3/4 max-w-[960px] border-none justify-center sm:justify-start" colour="rust"  items={[{name: 'Overview', Svg: BookIcon}, {name: 'Stars', Svg: StarIcon}, ...[showWatched && {name:'Watching', Svg: EyeIcon}]]}/>
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
							watchedBounties && showWatched &&	<Watching watchedBounties={watchedBounties} />
					}

				</div>
			</div>
		</div>
	</>
	);
};

export default AboutFreelancer;