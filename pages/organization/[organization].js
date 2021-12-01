// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
const contractMapping = require('../../constants/contract-map.json');

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
		console.log(org);
		setOrganizationData(org);
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
