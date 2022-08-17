// Third party
import React, { useState } from 'react';
// Custom
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import Carousel from '../Utils/Carousel';
import HorizontalOrganizationCard from './HorizontalOrganizationCard';
import useWeb3 from '../../hooks/useWeb3';

const OrganizationHomepage = ({ orgs, types }) => {
	// State
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
	const { account } = useWeb3();
	const filterByOrg = (e) => {
		setOrganizationSearchTerm(e.target.value);
	};

	// Render
	return (
		<div>
			<div className="text-center bg-[#161B22] py-14">
				<div className="text-2xl font-bold">Organizations</div>
				<div className="text-gray-500 text-md">GitHub organizations outsourcing to OpenQ</div>
			</div>
			<div className="lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center md:pr-3 mx-4 sm:mx-8 ">

				<div className="lg:col-start-2 justify-between justify-self-center space-y-2 w-full pb-8 max-w-[966px] mx-auto">

					<div className="flex flex-wrap items-center justify-center gap-4 w-full pt-10">
						<SearchBar
							onKeyUp={filterByOrg}
							searchText={organizationSearchTerm}
							placeholder="Search Organization..."
							styles={'rounded-sm w-full'}
						/>
						<MintBountyButton styles={'w-full'} types={types} />
					</div>
					<Carousel height={'80'}>
						{orgs.filter(organization => organization.starringUserIds && organization.starringUserIds.some(user => user === account))
							.map((org, index) => <OrganizationCard key={index} organization={org} />)}</Carousel>
					<div className="grid grid-cols-[repeat(3,_300px)] justify-center lg:justify-between">

					</div><div className=''>
						{orgs
							.filter((organization) => {
								return organizationSearchTerm
									? organization.name
										.toLowerCase()
										.indexOf(organizationSearchTerm.toLowerCase()) > -1
									: organization;
							}).map((elem, index) => <HorizontalOrganizationCard key={index} organization={elem} />)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrganizationHomepage;
