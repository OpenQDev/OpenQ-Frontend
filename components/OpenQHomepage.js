// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../store/Store/StoreContext';
import OrganizationCard from './OrganizationCard/OrganizationCard';

const OpenQHomepage = () => {
	// State
	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [isLoading, setIsLoading] = useState(true);
	const [organizations, setOrganizations] = useState(null);
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');

	// Methods
	async function populateOrganizationData() {
		const orgs = await appState.openQSubgraphClient.getOrganizations();
		console.log(orgs);

		let mergedOrgs = [];

		for (const organization of orgs) {
			const orgData = await appState.githubRepository.fetchOrganizationByName(organization.id);
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
	if (isLoading) {
		return <div>Loading...</div>;
	} else {
		return (
			<>
				<div className="grid grid-cols-1 gap-6 pr-20">
					<label>Organization</label>
					<input onKeyUp={(e) => filterByOrg(e)} type="text"></input>
					{organizations.filter(organization => {
						return organizationSearchTerm ? organization.name.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1 : organization;
					}).map((organization) => {
						return (
							<OrganizationCard
								organization={organization}
								key={organization.id}
							/>
						);
					})}
				</div>
			</>
		);
	}
};

export default OpenQHomepage;
