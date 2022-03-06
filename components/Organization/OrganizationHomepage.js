// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import useAuth from '../../hooks/useAuth';

const OrganizationHomepage = () => {
	// State
	// Context
	const [appState] = useContext(StoreContext);
	useAuth();

	// State
	const [isLoading, setIsLoading] = useState(true);
	const [organizations, setOrganizations] = useState(null);
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');

	// Methods
	async function populateOrganizationData() {
		let orgs = [];
		try {
			orgs = await appState.openQSubgraphClient.getOrganizations();
		} catch (error) {
			console.log(error);
		}

		let mergedOrgs = [];

		for (const organization of orgs) {
			let orgData = {};

			try {
				orgData = await appState.githubRepository.fetchOrganizationByName(
					organization.id
				);
			} catch (error) {
				console.log(error);
				continue;
			}
			const mergedOrgData = { ...organization, ...orgData };
			mergedOrgs.push(mergedOrgData);
		}

		setOrganizations(mergedOrgs);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		populateOrganizationData();
	}, []);

	// Methods

	const filterByOrg = (e) => {
		setOrganizationSearchTerm(e.target.value);
	};

	// Render
	return (
		<div>
			<div className="flex justify-center">
				<div className="grid gap-3 content-center">
					<SearchBar onKeyUp={filterByOrg} searchText={organizationSearchTerm} placeholder="Search Organization..." borderShape={'border rounded-full'} className="mb-200" />
					<MintBountyButton />
					{isLoading
						? null
						: organizations
							.filter((organization) => {
								return organizationSearchTerm
									? organization.name
										.toLowerCase()
										.indexOf(organizationSearchTerm.toLowerCase()) > -1
									: organization;
							})
							.map((organization) => {
								return (
									<div className="col-span-2 w-48" key={organization.id}>
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
