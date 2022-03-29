// Third Party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';

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
	const { address, first } = router.query;
	const [, setRedirectUrl] = useState('');
	const [, setIsLoading] = useState(true);
	const [internalMenu, setInternalMenu] = useState('view');

	// Refs
	const canvas = useRef();

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
		if(first){
			canvas.current.width = window.innerWidth;
			canvas.current.height = window.innerHeight;

			const canvasConfetti = confetti.create(canvas.current, {
				resize:true,
				useWorker: true
			});
			canvasConfetti({particleCount: 50,
				spread: window.innerWidth,
				origin: {
					x: 1,
					y: 0,}
			});
		}
	}, [address]);


	// Render
	
	return (
		<div className="flex flex-col font-mont justify-center items-center pt-7">
			<div className="flex flex-row space-x-2 border border-web-gray p-1 rounded-xl">
				<button
					onClick={() => setInternalMenu('view')}
					className={`text-white rounded-xl p-2 ${internalMenu == 'view' ? 'bg-inactive-gray' : null
					}`}
				>
						View
				</button>
				<button
					onClick={() => setInternalMenu('fund')}
					className={`text-white rounded-xl p-2 ${internalMenu == 'fund' ? 'bg-inactive-gray' : null
					}`}
				>
						Fund
				</button>
				<button
					onClick={() => setInternalMenu('refund')}
					className={`text-white rounded-xl p-2${internalMenu == 'refund' ? 'bg-inactive-gray' : null
					}`}
				>
						Refund
				</button>
				<button
					onClick={() => setInternalMenu('claim')}
					className={`text-white rounded-xl p-2 ${internalMenu == 'claim' ? 'bg-inactive-gray' : null
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
			<canvas className="absolute inset-0 pointer-events-none" ref={canvas}></canvas>
		</div>
	);
};


export default address;
