// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import OrganizationCard from '../Organization/OrganizationCard';
import SearchBar from '../Search/SearchBar';
import useAuth from '../../hooks/useAuth';

const OpenQHomepage = () => {
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
		const orgs = await appState.openQSubgraphClient.getOrganizations();

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
				<SearchBar onKeyUp={filterByOrg} className="mb-200" />
				<div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pr-20">
					{organizations.filter(organization => {
						return organizationSearchTerm ? organization.name.toLowerCase().indexOf(organizationSearchTerm.toLowerCase()) > -1 : organization;
					}).map((organization) => {
						return (
							<OrganizationCard
								className="lg: md: sm:"
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
