// Third party
import React, { useContext, useEffect, useRef, useState } from 'react';
import jazzicon from '@metamask/jazzicon';
import Image from 'next/image';

// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useEns from '../../hooks/useENS';
import AboutTitle from './AboutModules/AboutTitle';
import UserHistory from './AboutModules/UserHistory';
import Balances from './AboutModules/Balances';
import MiniBountyList from './AboutModules/MiniBountyList';
import { BookIcon, EyeIcon, StarIcon } from '@primer/octicons-react';
import SubMenu from '../Utils/SubMenu';
import Watching from './AboutModules/Watching';
import Starred from './AboutModules/Starred';
import StoreContext from '../../store/Store/StoreContext';

const AboutFreelancer = ({ user, organizations, starredOrganizations, showWatched, watchedBounties }) => {

	const { bountiesClosed, payoutTokenBalances, payouts } = user;
	const [internalMenu, setInternalMenu] = useState('Overview');
	const [appState] = useContext(StoreContext);
	const[watchedFullBounties, setWatchedFullBounties] = useState([]);
	const [githubUser, setGithubUser] = useState();
	const account = user.id;
	const [ensName] = useEns(account);
	// Context
	// State
	const [payoutTokenValues] = useGetTokenValues(payoutTokenBalances);

	useEffect(async()=>{
		const userLogin = user.bountiesClosed.find(bounty=>bounty.bountyType ==='0')?.claims[0].externalUserId;
		if(userLogin){	const githubUser  = await appState.githubRepository.fetchUserByLogin(userLogin);
			setGithubUser(githubUser);
		}
		else{
			setGithubUser(null);
		}
	},[]);

	useEffect(async () => {
		if (account && showWatched) {
			// get watched bounties as soon as we know what the account is.
			try {
				const watchedBountyAddresses = watchedBounties.map(
					(bounty) => bounty.address.toLowerCase()
				)||[];
				const subgraphBounties = await appState.openQSubgraphClient.getBountiesByContractAddresses(watchedBountyAddresses, ['0', '1','2']);
				const githubIds = subgraphBounties.map((bounty) => bounty.bountyId);
				const githubBounties = await appState.githubRepository.getIssueData(
					githubIds
				);
				setWatchedFullBounties(
					subgraphBounties.map((bounty, index) => {
						return { ...bounty,  ...githubBounties[index] };
					})
				);
			} catch (err) {
				console.log(err);
			}
		}
	}, [account, showWatched]);


	const iconWrapper = useRef(null);

	useEffect(async () => {
		if (account && iconWrapper.current&& githubUser ===null) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(300, parseInt(account.slice(2, 10), 16)));
		}
	}, [account, githubUser]);
	return (<>


		<div className='flex flex-col justify-center'>
			<SubMenu internalMenu={internalMenu} updatePage={setInternalMenu} styles="w-full justify-center lg:justify-start max-w-[600px] mx-auto border-none" colour="rust"  items={[{name: 'Overview', Svg: BookIcon}, {name: 'Stars', Svg: StarIcon}, ...[showWatched && {name:'Watching', Svg: EyeIcon}]]}/>
			<div className='w-full border-b h-px border-web-gray'></div>
			<div className="flex relative max-w-[1440px] w-full mx-auto">
				<div className='hidden lg:block max-w-[25%] border-web-gray pl-4 left-24 xl:left-20 relative left-24'>
					{	githubUser ? 
						<div className="flex ">
							<div className='flex items-center content-center relative top-4 xl:-top-4'>
								<Image
									src={githubUser.avatarUrl}
									width={ 292}
									height={ 292 }
									alt={'profile pic'}
									className="rounded-full"

								/></div>
						</div>
						: 
						<div className='float-right' >
	
							<div className='rounded-full h-72 w-72 xl:-mt-4 relative overflow-hidden' ref={iconWrapper}></div>
						</div>
					}
					{githubUser &&<> <a href={githubUser.url} className='block hover:underline pt-8 pl-4 text-xl font-semibold'>
					
						
						{githubUser.login}</a>
						
						
					<a className="pl-4 flex gap-2 hover:underline" href={githubUser.websiteUrl}>
						<svg className='fill-primary top-1 relative' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
							<path fillRule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z">
							</path>
						</svg>
						
						<span >
							{githubUser.websiteUrl}</span>
					</a></>
					}</div>
				
				<div className='flex flex-col flex-1 lg:pl-20 '>
					{internalMenu == 'Overview' ?
						(<div className=''>
							<AboutTitle ensName={ensName} account={account} githubUser={githubUser}/>

							<UserHistory organizations={organizations} payouts={payouts} />
							<Balances tokenBalances={payoutTokenBalances} tokenValues={payoutTokenValues} type="Total Payouts" />
							<MiniBountyList bounties={bountiesClosed} />
						</div>)
						: internalMenu == 'Stars' ?
							<Starred starredOrganizations={starredOrganizations} />
							:
							watchedBounties && showWatched &&	<Watching watchedBounties={watchedFullBounties} />
					}
				</div>

			</div>
		</div>
	</>
	);
};

export default AboutFreelancer;