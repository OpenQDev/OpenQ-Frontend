// Third party
import React, { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import StoreContext from '../../store/Store/StoreContext';

const OrganizationCard = ({ organization,  }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const [orgBounties, setOrgBounties] = useState();
	let orgName;
	if (organization.name) {
		orgName = organization?.name?.charAt(0).toUpperCase() + organization?.name.slice(1);
	} else if (organization.login) {
		orgName = organization?.login?.charAt(0).toUpperCase() + organization?.login.slice(1);
	}

	if (orgName?.length > 10) {
		orgName = orgName.slice(0, 9).concat('...');
	}

	useEffect(async()=>{
		const bountyIds = organization.bountiesCreated.map(bounty=>bounty.bountyId);
		
		try{
			const issuesData = await appState.githubRepository.getIssueData(bountyIds);
			const filteredBounties = appState.utils.combineBounties( organization.bountiesCreated, issuesData).filter(bounty=>{
				return !bounty.assignees.nodes[0] && bounty.status === 'OPEN' && bounty.bountyTokenBalances.length > 0;
			});
			setOrgBounties(filteredBounties);
		}
		catch(err){
			console.log('error');
		}
	}, organization.bountiesCreated);

	// Methods

	// Render
	return (
		<div className={!organization ? 'pointer-events-none cursor-normal' : undefined}>
			<Link href={(organization) ? `/organization/${organization.login}` : '/'}>
				<div
					className={
						'flex flex-col p-6 items-center font-mont rounded-xl shadow-sm border border-web-gray cursor-pointer pr-11 pl-11'
					}
				>
					<div className="w-16 h-16 relative">
						{organization?.avatarUrl ?
							<Image className='rounded-full' src={organization.avatarUrl} placeholder={'blur'} blurDataURL={'/diverse/placeholder-px.png'} alt="n/a" layout="fill" priority={true} /> :
							<Skeleton baseColor="#333" borderRadius={'1rem'} height={'64px'} width="64px" />}

					</div>
					<div className="pt-5 text-center font-semibold ">
						{orgName || <Skeleton width={'50px'} height={'16px'} baseColor={'#333'} />}
					</div>
					<div className=" rounded shadow-md text-gray-300 font-sans relative">


						{orgBounties && `${orgBounties.length
						}`}
						{
							orgBounties ? `${orgBounties.length === 1
								? ' Bounty'
								: ' Bounties'
							}` :
								<Skeleton width={'64px'} height={'16px'} baseColor={'#333'} />}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default OrganizationCard;
