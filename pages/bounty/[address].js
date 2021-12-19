// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import FundBountyButton from '../../components/FundBounty/FundBountyButton';
import RefundBountyButton from '../../components/RefundBounty/RefundBountyButton';
import ClaimBountyButton from '../../components/Claim/ClaimBountyButton';
import AuthButton from '../../components/Authentication/AuthButton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useAuth from '../../hooks/useAuth';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	useAuth();

	// State
	const { address } = router.query;
	const [redirectUrl, setRedirectUrl] = useState('');
	const [bounty, setBounty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);
		const bounty = await appState.openQSubgraphClient.getBounty(address);

		const issueData = await appState.githubRepository.fetchIssueById(
			bounty.bountyId
		);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty(mergedBounty);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (address) {
			setRedirectUrl(`${appState.baseUrl}/bounty/${address}`);
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
					<div className="flex flex-row">
						<div>
							<BountyCardDetails bounty={bounty} tokenValues={tokenValues} />
						</div>
						<div className="pt-10">
							{' '}
							<FundBountyButton bounty={bounty} />
						</div>
					</div>
					<RefundBountyButton address={address} issueUrl={bounty.url} />
					<ClaimBountyButton issueUrl={bounty.url} />
					<AuthButton redirectUrl={redirectUrl} />
				</div>
			</div>
		);
	}
};

export default address;
