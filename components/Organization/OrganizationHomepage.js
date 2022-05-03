// Third party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import StoreContext from '../../store/Store/StoreContext';
import OrganizationCard from '../Organization/OrganizationCard';
import MintBountyButton from '../MintBounty/MintBountyButton';
import SearchBar from '../Search/SearchBar';
import useAuth from '../../hooks/useAuth';
import UnexpectedError from '../Utils/UnexpectedError';

const OrganizationHomepage = () => {
	// State
	// Context
	const [appState] = useContext(StoreContext);
	useAuth();

	// State
	const [isLoading, setIsLoading] = useState(true);
	const [organizations, setOrganizations] = useState(null);
	const [organizationSearchTerm, setOrganizationSearchTerm] = useState('');
	const [error, updateError] = useState(false);

	// Methods
	async function populateOrganizationData() {
		let orgs = [];
		try {
			orgs = await appState.openQSubgraphClient.getOrganizations();
		} catch (error) {
			console.log(error);
		}
		const ids = orgs.map(org => org.id);
		let githubOrganizations = [];
		try {
			githubOrganizations = await appState.githubRepository.fetchOrgsOrUsersByIds(ids);
		}
		catch (err) {
			updateError(true);
			console.log(err);
		}
		let mergedOrgs = orgs.map((org) => {
			let currentGithubOrg;
			for (const githubOrganization of githubOrganizations) {
				if (org.id === githubOrganization.id) {
					currentGithubOrg = githubOrganization;
				}
			}
			return { ...org, ...currentGithubOrg };
		});

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
	if (error) { return <UnexpectedError />; }
	else return (
		<div className="lg:grid lg:grid-cols-extra-wide mx-8 xl:grid-cols-wide justify-center">
			<div className="lg:col-start-2 justify-between justify-self-center space-y-3 w-full pb-8 max-w-[900px]">
				<div className="grid gap-6 lg:grid-cols-[repeat(4,_1fr)] w-full mb-6">
					<SearchBar onKeyUp={filterByOrg} searchText={organizationSearchTerm} placeholder="Search Organization..." borderShape={'border rounded-full'} className="mb-200" />
					<MintBountyButton /></div>
				<div className="grid grid-cols-[repeat(_auto-fill,_192px)] gap-4 justify-center lg:justify-between mx-auto">
					{error ?
						<UnexpectedError />
						:
						isLoading
							? <><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /><OrganizationCard /></>
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
