// Third party
import React, {  useState, } from 'react';
// Custom
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';

const OrganizationHomepage = ({orgs}) => {

	// State
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');

	const filterByOrg = (e) => {
		setOrganizationSearchTerm(e.target.value);
	};

	// Render
	return (
		<div className="lg:grid lg:grid-cols-extra-wide mx-4 sm:mx-8 xl:grid-cols-wide justify-center">
			<div className="lg:col-start-2 justify-between justify-self-center space-y-3 w-full pb-8 max-w-[850px]">
				<div className="grid gap-6 lg:grid-cols-[repeat(4,_1fr)] w-full mb-6">
					<SearchBar onKeyUp={filterByOrg} searchText={organizationSearchTerm} placeholder="Search Organization..." borderShape={'border rounded-full'} className="mb-200" />
					<MintBountyButton /></div>
				<div className="grid grid-cols-[repeat(_auto-fill,_192px)] gap-4 justify-center lg:justify-between mx-auto">
					{orgs
						.filter((organization) => {
							return organizationSearchTerm
								? organization.name
									.toLowerCase()
									.indexOf(organizationSearchTerm.toLowerCase()) > -1
								: organization;
						})
						.map((organization) => {
							return (
								<div className="w-48" key={organization.id}>
									<OrganizationCard
										organization={organization}
										key={organization.id}
									/>
								</div>
							);
						})}

				</div>
			</div>
		</div>
	);
};

export default OrganizationHomepage;
