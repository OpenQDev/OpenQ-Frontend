// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import { ethers } from 'ethers';
import Link from 'next/link';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import FundPage from '../../components/FundBounty/FundPage';
import RefundPage from '../../components/RefundBounty/RefundPage';
import ClaimPage from '../../components/Claim/ClaimPage';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import UnexpectedError from '../../components/Utils/UnexpectedError';
import Toggle from '../../components/Toggle/Toggle';
import LoadingModal from '../../components/Loading/LoadingModal';

const address = () => {
	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const router = useRouter();

	const [bounty, setBounty] = useState(null);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances);

	// State
	const { address } = router.query;
	const [error, setError] = useState(false);
	const [internalMenu, setInternalMenu] = useState();
	const [isIndexing, setIsIndexing] = useState(false);
	const [showIndexingModal] = useState(true);
	const [noBounty, setNoBounty] = useState();

	// Refs
	const canvas = useRef();

	// Methods
	async function populateBountyData() {
		let bounty = null;
		let bountyData = null;
		let bountyMetadata = null;

		try {
			while (bountyData === null ) {
				bountyData = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
				if(!bountyData && !isIndexing){
					setNoBounty(true);
					return;
				}
				try{
					bountyMetadata = await appState.openQPrismaClient.getBounty(ethers.utils.getAddress(address));
				}
				catch(err){console.log(err);}
				bounty = {...bountyData, ...bountyMetadata};
			
				if (bountyData != null ) {
					setIsIndexing(false);
				}

				await sleep(500);
			}
			
			const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

			const mergedBounty = { ...bounty, ...issueData };

			setBounty({ ...mergedBounty });
		} catch (error) {
			console.log(error);
			setError(true);
			return;
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const refundCount = (deposits) => {
		let refund = 0;
		for (let deposit of deposits) {
			if (deposit.refunded === true) { refund++; }
		}
		return refund;
	};

	const setReload = () => {
		const payload = {
			type: 'UPDATE_RELOAD',
			payload: true
		};
		dispatch(payload);
	};

	// Fund: Change in deposits length
	// Claim: Change in bounty.status
	// Refund: Check that one of the deposits has been refunded
	// No faster than 1 second so begin with a sleep so as to not spam the Graph Hosted Service
	const refreshBounty = async () => {
		await sleep(1000);
		let newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
		try {
			const refundedBefore = refundCount(bounty.deposits);
			const refundedNow = refundCount(newBounty.deposits);
			while (newBounty.deposits.length === bounty.deposits.length && newBounty.status === bounty.status && refundedBefore === refundedNow) {
				newBounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
				await sleep(500);
			}
			const mergedBounty = { ...bounty, ...newBounty };
			setBounty(mergedBounty);
			setReload();
		}
		catch (error) {
			setError(true);
		}
	};

	// Hooks
	useEffect(() => {

		// Confetti
		const justMinted = sessionStorage.getItem('justMinted') === 'true';
		sessionStorage.setItem('justMinted', false);
		if (justMinted) {
			setReload();
			setIsIndexing(true);
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
		// set route and populate
		if (address) {
			const route = sessionStorage.getItem(address);

			if (route !== internalMenu) {
				setInternalMenu(route || 'View');
			}
			populateBountyData();
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
		<>{noBounty ? 
			<div className='flex fixed inset-0 mx-20 justify-center items-center 
	 h-screen'>
				<div className='text-2xl'>Bounty not found. <span className="underline"><Link href={'/'}>Go home</Link>
				</span>
	.</div>
			</div>: 
			<>
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
				{isIndexing && showIndexingModal && <LoadingModal graph={true} loadingText={{ title: 'Indexing Bounty', message: 'Please wait while your bounty is indexed.' }} />}

			</>}
		</>
	);
};


export default address;
