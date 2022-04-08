// Third Party Libraries
import React, { useState, useRef, } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

// Custom
import {
	CHECKING_WITHDRAWAL_ELIGIBILITY,
	WITHDRAWAL_INELIGIBLE,
	TRANSACTION_SUBMITTED,
	TRANSACTION_CONFIRMED,
	CONFIRM_CLAIM
} from './ClaimStates';
import useAuth from '../../hooks/useAuth';
import AuthButton from '../Authentication/AuthButton';
import useWeb3 from '../../hooks/useWeb3';
import ClaimLoadingModal from './ClaimLoadingModal';
import BountyClosed from '../BountyClosed/BountyClosed';
import useEns from '../../hooks/useENS';
import ToolTip from '../Utils/ToolTip';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const ClaimPage = ({ bounty, refreshBounty }) => {
	const { url } = bounty;
	// State
	const [error, setError] = useState('');
	const [transactionHash, setTransactionHash] = useState(null);
	const [claimState, setClaimState] = useState(CONFIRM_CLAIM);
	const [showClaimLoadingModal, setShowClaimLoadingModal] = useState(false);
	const [justClaimed, setJustClaimed] = useState(false);
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
	const canvas = useRef();

	const claimed = bounty.status == 'CLOSED';

	const updateModal = () => {
		setShowClaimLoadingModal(false);
		if(claimState===TRANSACTION_CONFIRMED){
			refreshBounty();
		}
		else{
			setClaimState(CONFIRM_CLAIM);
		}
	};

	// Context
	const { account, library } = useWeb3();
	const [ensName] = useEns(account);

	// Hooks
	const [authState] = useAuth();

	// Methods
	const claimBounty = async () => {
		setClaimState(CHECKING_WITHDRAWAL_ELIGIBILITY);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
				{
					issueUrl: url,
					payoutAddress: account,
				},
				{ withCredentials: true }
			)
			.then(async (result) => {
				const { txnHash } = result.data;
				// Upon this return, the claimBounty transaction has been submitted
				// We should now transition from Transaction Submitted -> Transaction Pending
				setTransactionHash(txnHash);
				setClaimState(TRANSACTION_SUBMITTED);
				await library.waitForTransaction(txnHash);
				setClaimState(TRANSACTION_CONFIRMED);
				setJustClaimed(true);
				
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
			})
			.catch((error) => {
				console.log(error);
				setClaimState(WITHDRAWAL_INELIGIBLE);
				setError({ message: error.response.data.errorMessage, title: 'Error' });
			});
	};

	if (claimed) {
		return (
			<BountyClosed bounty={bounty} showTweetLink={justClaimed} />
		);
	} else {
		return (
			<div className="flex flex-1 font-mont justify-center items-center">
				<div className="w-5/6 pt-16 pb-24">
					<div className="text-3xl font-semibold text-white text-center pb-5">
						Claim Bounty
					</div>
					<div className="grid grid-cols-3 gap-5">
						{!authState.isAuthenticated ? (
							<div className="bg-claimed-bounty-inside col-span-3 border border-claimed-bounty rounded-lg text-white p-4">
								We noticed you are not signed into Github. You must sign to verify
								and claim an issue!
							</div>
						) : (
							<div className="bg-green-inside col-span-3 border border-green rounded-lg text-white p-4">
								Successfully signed in, you can claim your issue now.
							</div>
						)}
						
						<div className="col-span-3 flex gap-3">
							<ToolTip
								outerStyles="w-full"
								hideToolTip={account && isOnCorrectNetwork} 
								toolTipText={
									account && isOnCorrectNetwork ?
										'Please indicate the volume you\'d like to claim with.':
										account ? 
											'Please switch to the correct network to claim this bounty.' : 
											'Connect your wallet to claim this bounty!' } 
								customOffsets={[0, 50]}>
								<button
									type="submit"
									className={account && isOnCorrectNetwork ? 'confirm-btn cursor-pointer' : 'confirm-btn-disabled cursor-not-allowed text-white' }
									disabled={!account || !isOnCorrectNetwork}
									onClick={() => setShowClaimLoadingModal(true)}
								>
								Claim
								</button>
							</ToolTip>
						</div>
						<AuthButton
							redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyAddress}`}
						/>
						{showClaimLoadingModal && <ClaimLoadingModal confirmMethod={claimBounty} url={url} ensName={ensName} account={account} error={error} claimState={claimState} login={'FlacoJones'} address={account} transactionHash={transactionHash} setShowClaimLoadingModal={updateModal} />}
					</div>
				</div>
				<canvas className="absolute inset-0 pointer-events-none" ref={canvas}></canvas>
			</div>
		);
	}
};

export default ClaimPage;
