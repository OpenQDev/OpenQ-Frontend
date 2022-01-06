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
				orgData = await appState.githubRepository.fetchOrganizationByName(organization.id);
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
	if (isLoading) {
		return <div>Loading...</div>;
	} else {
		return (
			<>
				<label className='font-bold text-l'>Organization</label>
				<SearchBar onKeyUp={filterByOrg} className="mb-200" />
				<div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pr-20">
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
