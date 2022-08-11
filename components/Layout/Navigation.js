// Third party
import React, { useState, useEffect, useContext } from 'react';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import axios from 'axios';
import Link from 'next/link';
// Custom
import StoreContext from '../../store/Store/StoreContext.js';
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Image from 'next/image';
import FirstTimeBanner from './FirstTimeBanner';
import useWeb3 from '../../hooks/useWeb3.js';
import ToolTipNew from '../Utils/ToolTipNew.js';
import { ThreeBarsIcon } from '@primer/octicons-react';
import LinkDropdown from '../Utils/LinkDropdown.js';
import { useRouter } from 'next/router.js';

const Navigation = () => {

	const [gnosisSafe, setGnosisSafe] = useState();
	const [safeInfo, setSafeInfo] = useState();
	const { account, activate, deactivate } = useWeb3();
	const [appState] = useContext(StoreContext);
	const [openMenu, setOpenMenu] = useState(false);
	const [quickSearch, setQuickSearch] = useState('');
	const [items, setItems] = useState([]);
	const [searchable, setSearchable] = useState();


	const router = useRouter();
	
	useEffect(() => {
		setQuickSearch('');
		setOpenMenu(false);
	}, [router.asPath]);

	useEffect(async()=>{
	},[]);

	useEffect(async () => {
	// set up searchable
		const subgraphOrganizations = await appState.openQSubgraphClient.getOrganizationIds();
	
		const subgraphBounties = await appState.openQSubgraphClient.getBountyIds();
		const githubOrganizations = await appState.githubRepository.searchOrgOrUser(subgraphOrganizations.organizations.map(organization=>organization.id));
		const prismaOrganizations = await appState.openQPrismaClient.getOrgsMetadata(subgraphOrganizations.organizations.map(organization=>organization.id));
		const githubIssues = await appState.githubRepository.getLeanIssueData(subgraphBounties.map(bounty=>bounty.bountyId));
		const prismaBounties = await appState.openQPrismaClient.getBlackListed(subgraphBounties.map(bounty=>bounty.bountyAddress));
		const fullOrgs = githubOrganizations.map((organization)=>{
			const prismaOrg = prismaOrganizations.find((prismaOrganization)=>{
				return prismaOrganization.id === organization.id;});
			return {...organization, ...prismaOrg};
		}).filter(org=>!org.blacklisted);
		const fullBounties = appState.utils.combineBounties(subgraphBounties, githubIssues, prismaBounties).filter(bounty=>!bounty.blacklisted);
		const searchable = [...fullBounties, ...fullOrgs].map(searchableItem=>{
			const url = searchableItem.title? `${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${searchableItem.bountyId}/${searchableItem.bountyAddress}`: `${process.env.NEXT_PUBLIC_BASE_URL}/organization/${searchableItem.login}`;
			const name = searchableItem.name ||searchableItem.title|| searchableItem.login;
		
			return {name: name.toLowerCase(), url, isIssue: searchableItem.title};
		});
		
		setSearchable(searchable);
		// set up gnosis safe
		const safe = new SafeAppConnector();
		safe.getSafeInfo().then((data) => {
			if (data) {
				setSafeInfo(data);
				deactivate();
			}
		});
		setGnosisSafe(safe);

		// set up tokens
		const GET_PRICES = {
			query: `{
			prices {
    				timestamp
    				priceObj
  			
			}
		}`,
		};
		let tokenPrices = {};

		try {
			if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'local') {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_OPENQ_API_URL}/prices`
				);
				tokenPrices = response.data[0].priceObj;
			} else {
				const response = await axios({
					url: process.env.NEXT_PUBLIC_OPENQ_API_URL,
					method: 'post',
					headers: { 'content-type': 'application/json' },
					data: GET_PRICES,
				});
				tokenPrices = response?.data?.data?.prices?.priceObj || {};
			}
		} catch (err) {
			console.log('could not fetch initial prices', err);
		}

		appState.tokenClient.firstTenPrices = tokenPrices;
	}, []);

	useEffect(async () => {
		if (safeInfo) {
			await activate(gnosisSafe);
		}
	}, [account]);
	
	const handleSearch = (e)=>{
		setQuickSearch(e.target.value);

		const names = searchable.filter(searchableItem=>{
			return	searchableItem.name.includes(e.target.value.toLowerCase());
		}).map(searchableItem=>searchableItem);
		setItems(e.target.value? names.slice(0, 5) : []);
	};


	return (
		<div className="bg-nav-bg py-1 ">
			<FirstTimeBanner />

			{/* Desktop view */}

			<div className="flex visible relative">

				<div className="flex w-full md:py-1 justify-between mx-4">

					<div className="flex space-x-5 items-center">
						<Link href={'/'}>
							<a className="flex items-center md:hover:opacity-70">
								<Image
									src="/openq-logo-white-2.png"
									alt="OpenQ"
									width="31"
									height="31"
								/>
							</a>
						</Link>
						<button className="flex md:hidden" onClick={() => setOpenMenu(!openMenu)}>
							<ThreeBarsIcon size={24} />
						</button>

						<div className="md:flex hidden  content-center  items-center">
							<div className='flex-col justify-center mr-2 h-7 group '>
								<input
									className={`md:flex hidden pr-24 items-center focus:w-80 w-60  left-0 input-field transition-all  ease-in-out duration-700 ${quickSearch && 'focus:w-96'}`}
									onChange={handleSearch}
									value={quickSearch}
									type="text"
									placeholder="Search OpenQ"
								></input>
								{quickSearch && <LinkDropdown  items= {items}/>}</div>
							<Link href={'/atomic-contracts'}>
								<a >
									<div className={`mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer ${router.asPath ==='/atomic-contracts' && 'text-white'}`}>
										Atomic contracts
									</div>
								</a>
							</Link>
							<Link href={'/contests'}>
								<a >
									<div className={`mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer ${router.asPath ==='/contests' && 'text-white'}`}>
									Contests
									</div>
								</a>
							</Link>
							<Link href={'/repeatable'}>
								<a >
									<div className={`mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer ${router.asPath ==='/repeatable' && 'text-white'}`}>
									Repeatable
									</div>
								</a>
							</Link>
							<Link href={'/organizations'}>
								<a >
									<div className={`mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer ${router.asPath ==='/organizations' && 'text-white'}`}>
									Organizations
									</div>
								</a>
							</Link>
							<Link href={'/'}>
								<a >
									<div className={`mx-2 text-[0.8rem] tracking-wider md:hover:text-primary text-muted font-bold hover:cursor-pointer ${router.asPath ==='/' && 'text-white'}`}>
									Explore
									</div>
								</a>
							</Link>
						</div>
					</div>
					<div className="flex items-center text-[0.8rem] md:text-[1rem]">
						<div>
							<ConnectButton />
						</div>
						<div>
							<ProfilePicture />
						</div>
					</div>
				</div>
			</div>
			{openMenu ?
				<div className="flex md:hidden w-full">
					<div className="flex flex-col p-4 space-x-1 space-y-2 w-full">
						<div className='flex-col mr-2 h-7  group'>
							<input
								className="flex pr-24 items-center input-field"
								onChange={handleSearch}
								value={quickSearch}
								type="text"
								placeholder="Search OpenQ"
							></input>
							{quickSearch && <LinkDropdown  items= {items}/>}</div>
						<Link href={'/'}>
							<a className="flex items-center pt-1 border-t border-gray-700">
								<div className="text-[0.8rem] tracking-wider text-nav-text font-bold">
									Atomic contracts
								</div>
							</a>
						</Link>
						<ToolTipNew toolTipText={'Coming soon'} >
							<div className="flex text-[0.8rem] pt-1 border-t border-gray-700 tracking-wider text-nav-text font-bold text-opacity-20">
								Contests
							</div>
						</ToolTipNew>
						<ToolTipNew toolTipText={'Coming soon'} >
							<div className="flex text-[0.8rem] pt-1 border-t border-gray-700 tracking-wider text-nav-text font-bold text-opacity-20">
								Repeatable
							</div>
						</ToolTipNew>
						<ToolTipNew toolTipText={'Coming soon'} >
							<div className="flex text-[0.8rem] pt-1 border-t border-gray-700 tracking-wider text-nav-text font-bold text-opacity-20">
								Organizations
							</div>
						</ToolTipNew>
						<ToolTipNew toolTipText={'Coming soon'} >
							<div className="flex text-[0.8rem] pt-1 border-t border-gray-700 tracking-wider text-nav-text font-bold text-opacity-20">
								Explore
							</div>
						</ToolTipNew>
					</div>
				</div>
				:
				null
			}
			{/*   <Footer /> */}
		</div>
	);
};

export default Navigation;
