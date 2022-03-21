// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import FundPage from '../../components/FundBounty/FundPage';
import RefundPage from '../../components/RefundBounty/RefundPage';
import ClaimPage from '../../components/Claim/ClaimPage';
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
	const [, setIsLoading] = useState(true);
	const [internalMenu, setInternalMenu] = useState('view');

	// Methods
	async function populateBountyData() {
		setIsLoading(true);
		let bounty;

		// or is it null?
		while (bounty === undefined) {
			bounty = await appState.openQSubgraphClient.getBounty(address);
			await sleep(500);
		}

		const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty({ ...mergedBounty });
		setIsLoading(false);
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const refreshBounty = async () => {
		await sleep(1000);
		let newBounty = await appState.openQSubgraphClient.getBounty(address, 'network-only');
		const mergedBounty = { ...bounty, ...newBounty };
		setBounty(mergedBounty);
	};

	// Hooks
	useEffect(() => {
		if (address) {
			setRedirectUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${address}`);
			populateBountyData();
		}
	}, [address]);

	// Render
	
	return (
		<div className="flex flex-col font-mont justify-center items-center pt-7">
			<div className="flex flex-row space-x-2 border border-web-gray p-1 rounded-xl">
				<button
					onClick={() => setInternalMenu('view')}
					className={`text-white rounded-xl p-2 bg-opacity-20 ${internalMenu == 'view' ? 'bg-gray-500' : null
					}`}
				>
						View
				</button>
				<button
					onClick={() => setInternalMenu('fund')}
					className={`text-white rounded-xl p-2 bg-opacity-20 ${internalMenu == 'fund' ? 'bg-gray-500' : null
					}`}
				>
						Fund
				</button>
				<button
					onClick={() => setInternalMenu('refund')}
					className={`text-white rounded-xl p-2 bg-opacity-20 ${internalMenu == 'refund' ? 'bg-gray-500' : null
					}`}
				>
						Refund
				</button>
				<button
					onClick={() => setInternalMenu('claim')}
					className={`text-white rounded-xl p-2 bg-opacity-20 ${internalMenu == 'claim' ? 'bg-gray-500' : null
					}`}
				>
						Claim
				</button>
			</div>
			{internalMenu == 'view' ? (
				<BountyCardDetails bounty={bounty} tokenValues={tokenValues} />
			) : null}
			{internalMenu == 'fund' ? <FundPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
			{internalMenu == 'claim' ? <ClaimPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
			{internalMenu == 'refund' ? (<RefundPage bounty={bounty} refreshBounty={refreshBounty} />) : null}
		</div>
	);
};


export default address;
