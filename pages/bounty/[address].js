// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useAuth from '../../hooks/useAuth';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	useAuth();

	const [bounty, setBounty] = useState(null);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

	// State
	const { address } = router.query;
	const [, setRedirectUrl] = useState('');
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
			setRedirectUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${address}`);
			populateBountyData();
		}
	}, [address]);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div className="flex flex-col font-mont pt-7 justify-center items-center">
				<div className="flex flex-row space-x-2 border border-web-gray bg-zinc-300 p-1 rounded-xl">
					<div className="text-white bg-gray-500 rounded-xl p-2 bg-opacity-20">
						View
					</div>
					<div className="text-white  rounded-xl p-2 bg-opacity-20">Manage</div>
				</div>
				<BountyCardDetails bounty={bounty} tokenValues={tokenValues} />
			</div>
		);
	}
};

export default address;

/* <FundBountyButton bounty={bounty} />

<RefundBountyButton
	bounty={bounty}
	address={address}
	issueUrl={bounty.url}
/>
<ClaimBountyButton issueUrl={bounty.url} />
<AuthButton redirectUrl={redirectUrl} /> */
