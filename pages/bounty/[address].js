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
import UnexpectedError from '../../components/Utils/UnexpectedError';
import Toggle from '../../components/Toggle/Toggle';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	useAuth();

	const [bounty, setBounty] = useState(null);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

	// State
	const { address, first, } = router.query;
	const [, setRedirectUrl] = useState('');
	const [, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const [internalMenu, setInternalMenu] = useState();

	// Refs
	const canvas = useRef();

	// Methods
	async function populateBountyData() {
		setIsLoading(true);
		let bounty;

		try {
			// or is it null?
			while (bounty === undefined) {
				console.log('bounty in [address] loop', bounty);
				bounty = await appState.openQSubgraphClient.getBounty(address);
				await sleep(500);
			}

			console.log('bounty after [address] loop', bounty);

			const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

			const mergedBounty = { ...bounty, ...issueData };

			setBounty({ ...mergedBounty });
			setIsLoading(false);
		}
		catch (error) {
			console.log(error);
			setError(true);
			return;
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const refreshBounty = async () => {
		await sleep(1000);
		try {
			let newBounty = await appState.openQSubgraphClient.getBounty(address, 'network-only');
			const mergedBounty = { ...bounty, ...newBounty };
			setBounty(mergedBounty);
		}
		catch (error) {
			setError(true);
		}
	};

	// Hooks
	useEffect(() => {
		if (address) {
			const route = sessionStorage.getItem(address);

			if (route !== internalMenu) {
				setInternalMenu(route || 'View');
			}
			setRedirectUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${address}`);
			populateBountyData();
		}
		if (first) {
			canvas.current.width = window.innerWidth;
			canvas.current.height = window.innerHeight;

			const canvasConfetti = confetti.create(canvas.current, {
				resize: true,
				useWorker: true
			});
			canvasConfetti({
				particleCount: 50,
				spread: window.innerWidth,
				origin: {
					x: 1,
					y: 0,
				}
			});
		}
	}, [address]);

	// User Methods

	const handleToggle = (e) => {
		setInternalMenu(e);
		sessionStorage.setItem(address, e);
	};

	// Render
	if (error) {
		return <UnexpectedError />;
	}
	else return (
		<div className="flex flex-col font-mont justify-center items-center pt-7">
			<Toggle toggleFunc={handleToggle} toggleVal={internalMenu} names={['View', 'Fund', 'Refund', 'Claim']} />
			{internalMenu == 'View' ? (
				<BountyCardDetails bounty={bounty} tokenValues={tokenValues} />
			) : null}
			{internalMenu == 'Fund' && bounty ? <FundPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
			{internalMenu == 'Claim' && bounty ? <ClaimPage bounty={bounty} refreshBounty={refreshBounty} /> : null}
			{internalMenu == 'Refund' && bounty ? (<RefundPage bounty={bounty} refreshBounty={refreshBounty} />) : null}
			<canvas className="absolute inset-0 pointer-events-none" ref={canvas}></canvas>
		</div>
	);
};


export default address;
