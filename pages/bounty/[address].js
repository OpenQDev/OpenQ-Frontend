// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import FundPage from '../../components/FundBounty/FundPage';
import RefundBountyButton from '../../components/RefundBounty/RefundBountyButton';
import ClaimPage from '../../components/Claim/ClaimPage';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import useAuth from '../../hooks/useAuth';
import useWeb3 from '../../hooks/useWeb3';

const address = () => {
	// Context
	const { library } = useWeb3();
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	useAuth();

	const [bounty, setBounty] = useState(null);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

	// State
	const { address } = router.query;
	const [, setRedirectUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [internalMenu, setInternalMenu] = useState('view');

	// Methods
	async function populateBountyData() {
		setIsLoading(true);
		const bounty = await appState.openQSubgraphClient.getBounty(address);

		const issueData = await appState.githubRepository.fetchIssueById(
			bounty.bountyId
		);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty({ ...mergedBounty });
		setIsLoading(false);
	}

	async function updateDeposit(args) {
		console.log(args);
		const newBounty = await appState.openQSubgraphClient.getBounty(address);
		const mergedBounty = { ...bounty, ...newBounty };
		setBounty(mergedBounty);
	}

	useEffect(() => {
		if (bounty && address) {
			appState.openQClient.subscribeDepositEvents(library, process.env.NEXT_PUBLIC_OPENQ_ADDRESS, address, updateDeposit);
		}
	}, [address, bounty]);

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
			<div className="flex flex-col font-mont justify-center items-center pt-7">
				<div className="flex flex-row space-x-2 border border-web-gray bg-zinc-300 p-1 rounded-xl">
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
				{internalMenu == 'fund' ? <FundPage bounty={bounty} /> : null}
				{internalMenu == 'claim' ? <ClaimPage bounty={bounty} /> : null}
				{internalMenu == 'refund' ? (
					<RefundBountyButton
						bounty={bounty}
						address={address}
						issueUrl={bounty.url}
					/>
				) : null}
			</div>
		);
	}
};

export default address;
