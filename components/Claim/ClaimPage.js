// Third party Libraries
import React, { useState, useRef, useContext } from 'react';
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
import ToolTipNew from '../Utils/ToolTipNew';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';

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
	
	const [, dispatch] = useContext(StoreContext);


	const claimed = bounty.status == 'CLOSED';

	const updateModal = () => {
		setShowClaimLoadingModal(false);
		if (claimState === TRANSACTION_CONFIRMED) {
			refreshBounty();
		}
		else {
			setClaimState(CONFIRM_CLAIM);
		}
	};

	// Context
	const { account, library } = useWeb3();
	const [ensName] = useEns(account);

	// Hooks
	const [authState] = useAuth();

	// Methods
	const connectWallet = ()=>{
		const payload = {
			type: 'CONNECT_WALLET',
			payload: true
		};
		dispatch(payload);
	};

	const claimBounty = async () => {
		setClaimState(CHECKING_WITHDRAWAL_ELIGIBILITY);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_ORACLE_URL}/claim`,
				{
					issueUrl: url,
					payoutAddress: account
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
			<>
			<div className="flex flex-1 justify-center">
				<div className="w-5/6 pt-8 pb-24 min-w-min">
					<div className="flex flex-col gap-5 pt-12">
						{!authState.isAuthenticated ? (
							<div className=" col-span-3 border border-gray-700 bg-[#21262d] rounded-sm p-4">
								We noticed you are not signed into Github. You must sign to verify
								and claim an issue!
							</div>
						) : null}
						<div className='col-span-3 p-4 my-4 '>
							<p>Don{'\''}t forget to add a closer comment for this bounty on your pull request :-).</p>
							<div><CopyAddressToClipboard noClip={true} data={`Closes #${bounty.number}`} /></div>
						</div>

						<div className="flex flex-col space-y-5">
							<ToolTipNew
								outerStyles="flex w-full items-center"
								hideToolTip={account && isOnCorrectNetwork && authState.isAuthenticated}
								toolTipText={
									account && isOnCorrectNetwork && authState.isAuthenticated ?
										'Please indicate the volume you\'d like to claim with.' :
										account && authState.isAuthenticated ?
											'Please switch to the correct network to claim this bounty.' :
											(!account) ?
												'Connect your wallet to claim this bounty!' :
												'Connect your GitHub account to claim this bounty!'
								}>
								<button
									type="submit"
									className={(isOnCorrectNetwork && authState.isAuthenticated) || !account ? 'btn-primary cursor-pointer w-full p-2' : 'btn-default cursor-not-allowed w-full p-2'}
									disabled={(!isOnCorrectNetwork || !authState.isAuthenticated) && account}
									onClick={account ? () => setShowClaimLoadingModal(true) : connectWallet}
								>
									{account ? 'Claim' : 'Connect Wallet'}
								</button>
							</ToolTipNew>
						</div>
						<div className="flex items-center col-span-3">
						<AuthButton
							hideSignOut={true}
							redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyId}/${bounty.bountyAddress}`}
						/>
						</div>
						{showClaimLoadingModal && <ClaimLoadingModal confirmMethod={claimBounty} url={url} ensName={ensName} account={account} error={error} claimState={claimState} login={'FlacoJones'} address={account} transactionHash={transactionHash} setShowClaimLoadingModal={updateModal} />}
					</div>
				</div>
				<canvas className="absolute inset-0 pointer-events-none" ref={canvas}></canvas>
			</div>
			</>
		);
	}
};

export default ClaimPage;
