// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import MintBountyContext from './MintBountyStore/MintBountyContext';
import BountyAlreadyMintedMessage from './BountyAlreadyMintedMessage';
import ToolTip from '../Utils/ToolTip';
import {
	RESTING_STATE,
	BOUNTY_DOES_NOT_EXIST,
	ISSUE_FOUND,
	VALID_URL,
	INVALID_URL,
	BOUNTY_EXISTS,
	ERROR,
	TRANSACTION_PENDING,
	TRANSACTION_FAILURE,
	ISSUE_NOT_FOUND,
	WALLET_CONNECTED,
	WALLET_DISCONNECTED
} from './MintBountyStates';
import MintBountyModalButton from './MintBountyModalButton';
import MintBountyHeader from './MintBountyHeader';
import MintBountyInput from './MintBountyInput';
import ErrorModal from '../ConfirmErrorSuccessModals/ErrorModal';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const MintBountyModal = ({ modalVisibility }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const [mintBountyState, setMintBountyState] = useContext(MintBountyContext);
	const { library, active, account, } = useWeb3();
	const router = useRouter();

	// State
	// GitHub Issue State
	const [issueUrl, setIssueUrl] = useState('');
	const [isLoadingIssueData, setIsLoadingIssueData] = useState('');
	const [errorModal, setShowErrorModal] = useState(false);
	const [isOnCorrectNetwork] = useIsOnCorrectNetwork();

	const {
		bountyAddress,
		claimed,
		isValidUrl,
		issueClosed,
		transactionPending,
		issueData,
		issueFound,
		enableMint,
		error,
		isLoading
	} = mintBountyState;

	// Refs
	const modal = useRef();

	// Hooks
	useEffect(() => {
		if (active) {
			setMintBountyState(WALLET_CONNECTED());
		} else {
			setMintBountyState(WALLET_DISCONNECTED());
		}
	}, [account]);

	useEffect(async () => {
		setMintBountyState(RESTING_STATE());

		let issurUrlIsValid = appState.utils.issurUrlRegex(issueUrl);

		if (issurUrlIsValid) {
			setMintBountyState(VALID_URL(issueUrl));
		} else {
			setMintBountyState(INVALID_URL(issueUrl));
		}
	}, [issueUrl]);

	useEffect(() => {
		let didCancel = false;
		if (mintBountyState.isValidUrl) {
			setIsLoadingIssueData(true);
			async function fetchIssue() {
				try {
					const data = await appState.githubRepository.fetchIssueByUrl(issueUrl);
					if (!didCancel) {
						setMintBountyState(
							ISSUE_FOUND(data)
						);
						setIsLoadingIssueData(false);
					}
				} catch (error) {
					setMintBountyState(ISSUE_NOT_FOUND(error));
					setIsLoadingIssueData(false);
				}
			}
			fetchIssue();
		}
		return (() => {
			didCancel = true;
		});
	}, [mintBountyState.issueUrl]);

	useEffect(() => {
		let didCancel = false;
		if (mintBountyState.issueData) {
			async function alreadyExists() {
				try {
					let bounty = await appState.openQSubgraphClient.getBounty(
						mintBountyState.issueData.id,
						'no-cache'
					);
					if (!didCancel) {
						if (bounty) {
							setMintBountyState(BOUNTY_EXISTS(bounty));
						} else {
							setMintBountyState(BOUNTY_DOES_NOT_EXIST());
						}
					}
				} catch (error) {
					setMintBountyState(ERROR(error));
					setShowErrorModal(true);
				}
			}

			alreadyExists();
		}
		return (() => {
			didCancel = true;
		});
	}, [mintBountyState.issueData]);

	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target)) {
				modalVisibility(false);
			}
		}

		// Bind the event listener
		if (!isLoading) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal, isLoading]);

	// Methods
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function mintBounty() {
		try {
			setMintBountyState(TRANSACTION_PENDING());
			const { bountyAddress } = await appState.openQClient.mintBounty(
				library,
				mintBountyState.issueId,
				mintBountyState.orgId
			);

			await sleep(1000);

			sessionStorage.setItem('justMinted', true);
			appState.githubBot.created({bountyId: issueData.id},);
			router.push(
				`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bountyAddress}`
			);
		} catch (error) {
			console.log('error in mintbounty', error);
			const { message, title } = appState.openQClient.handleError(error);
			setMintBountyState(TRANSACTION_FAILURE({ message, title }));
			setShowErrorModal(true);
		}
	}

	const closeModal = () => {
		setShowErrorModal(false);
		setMintBountyState(RESTING_STATE());
		modalVisibility(false);
	};

	// Render
	return (
		<div className="flex justify-center items-center font-mont overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-5">
			{errorModal ?
				<ErrorModal
					setShowErrorModal={closeModal}
					error={error}
				/> :
				<>
					<div ref={modal} className="md:w-1/2 lg:w-1/3 xl:w-1/4 space-y-5 z-50">
						<div className="w-full">
							<div className="border-0 rounded-xl shadow-lg flex flex-col bg-dark-mode outline-none focus:outline-none z-11">
								<MintBountyHeader />
								<div className="flex flex-col pl-6 pr-6 space-y-2">
									<MintBountyInput
										setIssueUrl={setIssueUrl}
										issueData={issueData}
										isValidUrl={isValidUrl}
									/>
								</div>
								{/* {error ? errorMessage : null} */}
								{isValidUrl && !issueFound && isLoadingIssueData ? (
									<div className="pt-5 self-center">
										<LoadingIcon bg={'white'} />
									</div>
								) : null}
								{isValidUrl && !issueFound && !isLoadingIssueData ? (
									<div className="pl-10 pt-5 text-white">
										Github Issue not found
									</div>
								) : null}
								<div className="flex flex-col justify-center space-x-1 px-8">
									{isValidUrl && issueClosed && issueFound ? (
										<div className="pt-3 text-white">
											This issue is already closed on GitHub
										</div>
									) : null}
									{isValidUrl && bountyAddress && issueFound ? (
										<BountyAlreadyMintedMessage claimed={claimed} bountyAddress={bountyAddress} />
									) : null}
								</div>

								<ToolTip
									hideToolTip={(enableMint && isOnCorrectNetwork) || transactionPending}
									toolTipText={
										account && isOnCorrectNetwork ?
											'Please choose an elgible issue.' :
											account ?
												'Please switch to the correct network to mint a bounty.' :
												'Connect your wallet to mint a bounty!'}
									customOffsets={[0, 70]}>
									<div className="flex items-center justify-center p-5 rounded-b w-full">
										<MintBountyModalButton
											mintBounty={mintBounty}
											enableMint={enableMint && isOnCorrectNetwork}
											transactionPending={transactionPending}
										/>
									</div>
								</ToolTip>
							</div>
						</div>
					</div>
					<div className="bg-overlay fixed inset-0 z-10"></div>
				</>}
		</div>
	);
};

export default MintBountyModal;
