// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';

const organization = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { organization } = router.query;
	const [isLoading, setIsLoading] = useState(true);
	const [organizationData, setOrganizationData] = useState(null);

	// Methods
	async function populateOrganizationData() {
		const org = await appState.openQSubgraphClient.getOrganization(organization.toLowerCase());

		const orgData = await appState.githubRepository.fetchOrganizationByName(organization);

		const mergedOrgData = { ...org, ...orgData };
		console.log(mergedOrgData);
		setOrganizationData(mergedOrgData);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (organization) {
			populateOrganizationData();
		}
	}, [organization]);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div>
				<div>{JSON.stringify(organizationData)}</div>
			</div>
		);
	}
};

export default organization;
