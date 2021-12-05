// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCard/BountyCardDetails';
import FundBounty from '../../components/FundBounty/FundBounty';
import RefundBounty from '../../components/RefundBounty/RefundBounty';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [bounty, setBounty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounty = await appState.openQSubgraphClient.getBounty(address.toLowerCase());

		const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty(mergedBounty);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (address) {
			populateBountyData();
		}
	}, [address]);

	// Refactor this hook our to be shared
	const [tokenValues] = useGetTokenValues(bounty);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div>
				<div className="flex font-mont pt-7 justify-center items-center">
					<div className="">
						<div className="flex flex-col">
							{tokenValues ? (<BountyCardDetails
								bounty={bounty}
								tokenValues={tokenValues}
							/>) : null}
						</div>
						<FundBounty address={address} />
						<RefundBounty address={address} issueUrl={bounty.url} />
					</div>
				</div>
			</div >
		);
	}
};

export default address;
