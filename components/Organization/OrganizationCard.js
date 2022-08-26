// Third party
import React, { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import starOrganization from './starOrganization';

const OrganizationCard = ({ organization }) => {
	// Context
	const context = useContext(StoreContext);
	const [orgBounties, setOrgBounties] = useState();
	const [starred, setStarred] = useState();
	const [starredDisabled, setStarredDisabled] = useState(true);
	const { account } = useWeb3();

	useEffect(() => {
		if ((organization.starringUserIds && organization.starringUserIds.some(user => user === account)) || organization.starred) {
			setStarred(true);
		}
		setStarredDisabled(false);
	}, [account]);

	const handleStar = (e) => {
		e.stopPropagation();
		starOrganization(account, organization.id, starred, setStarred, setStarredDisabled, context);
	};

	let orgName;
	if (organization.name) {
		orgName =
			organization?.name?.charAt(0).toUpperCase() + organization?.name.slice(1);
	} else if (organization.login) {
		orgName =
			organization?.login?.charAt(0).toUpperCase() +
			organization?.login.slice(1);
	}

	if (orgName?.length > 10) {
		orgName = orgName.slice(0, 9).concat('...');
	}

	useEffect(async () => {
		if (organization) {
			const filteredBounties = organization.bounties.nodes.filter(contract => !contract.blacklisted);
			setOrgBounties(filteredBounties);
		}
	}, [organization.bountiesCreated]);

	// Methods
	// Render
	return (
		<div
			className={`min-w-[300px] w-60 ${!starred ? 'hidden' : null}`}
		>
			<Link href={`/organization/${organization.login}`}>
				<div
					className={
						'flex flex-col p-6 items-center cursor-pointer text-[0.8rem] tracking-wider placeholder-input-gray outline-none rounded-sm border border-border-gray bg-menu-bg w-full h-72 mb-1'
					}
				>
					<div className="flex justify-end w-full items-center -mt-2 relative pt-2">
						{starred &&
							<button onClick={handleStar} disabled={starredDisabled}>
								<svg xmlns="http://www.w3.org/2000/svg" className='fill-muted' viewBox="0 0 24 24" width="24" height="24">
									<path fillRule="evenodd" d="M12.672.668a.75.75 0 00-1.345 0L8.27 6.865l-6.838.994a.75.75 0 00-.416 1.279l4.948 4.823-1.168 6.811a.75.75 0 001.088.791L12 18.347l6.117 3.216a.75.75 0 001.088-.79l-1.168-6.812 4.948-4.823a.75.75 0 00-.416-1.28l-6.838-.993L12.672.668z">
									</path>
								</svg>
							</button>}
					</div>
					<div className="pt-2">
						<div className="w-16 h-16 relative">
							{organization?.avatarUrl ? (
								<Image
									className="rounded-full"
									src={organization.avatarUrl}
									placeholder={'blur'}
									blurDataURL={'/diverse/placeholder-px.png'}
									alt="n/a"
									layout="fill"
									priority={true}
								/>
							) : (
								<Skeleton
									baseColor="#333"
									borderRadius={'1rem'}
									height={'64px'}
									width="64px"
								/>
							)}
						</div>
					</div>
					<div className="pt-5 text-center w-full font-medium text-xl ">
						{orgName || (
							<Skeleton width={'50px'} height={'16px'} baseColor={'#333'} />
						)}
					</div>
					<div className=" rounded shadow-md text-gray-300 text-lg font-sans relative">
						{orgBounties && `${orgBounties.length}`}
						{orgBounties ? (
							`${orgBounties.length === 1 ? ' Bounty' : ' Bounties'}`
						) : (
							<Skeleton width={'64px'} height={'16px'} baseColor={'#333'} />
						)}
					</div>
					<div className="text-center pt-2 text-gray-400 h-20">
						{organization.description || organization.bio}
					</div>
				</div>
			</Link>
		</div>
	);
};

export default OrganizationCard;
