// Third Party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import MintBountyContext from './MintBountyStore/MintBountyContext';
import BountyAlreadyMintedMessage from './BountyAlreadyMintedMessage';
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
} from './States';
import MintBountyModalButton from './MintBountyModalButton';
import MintBountyHeader from './MintBountyHeader';
import MintBountyInput from './MintBountyInput';
import ErrorModal from '../ConfirmErrorSuccessModals/ErrorModal';

const MintBountyModal = ({ modalVisibility }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const [mintBountyState, setMintBountyState] = useContext(MintBountyContext);
	const { library, active, account } = useWeb3();
	const router = useRouter();

	// State
	// GitHub Issue State
	const [issueUrl, setIssueUrl] = useState('');
	const [isLoadingIssueData, setIsLoadingIssueData] = useState('');
	const [, setShowErrorModal] = useState(false);

	const {
		bountyAddress,
		isValidUrl,
		issueClosed,
		transactionPending,
		issueData,
		issueFound,
		enableMint,
		error
	} = mintBountyState;

	// Refs
	let menuRef = useRef();
	let notifyMenuRef;

	useEffect(() => {
		if (active) {
			setMintBountyState(WALLET_CONNECTED());
		} else {
			setMintBountyState(WALLET_DISCONNECTED());
		}
	}, [account]);


	useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				if (mintBountyState.isBountyMinted) {
					if (!notifyMenuRef.current.contains(event.target)) {
						modalVisibility(false);
					}
				} else {
					modalVisibility(false);
				}
			}
		};

		window.addEventListener('mousedown', handler);

		return () => {
			window.removeEventListener('mousedown', handler);
		};
	});

	// Hooks
	useEffect(() => {
		setMintBountyState(RESTING_STATE());

		let pathArray = appState.utils.parseGitHubUrl(issueUrl);

		if (pathArray == null) {
			setMintBountyState(INVALID_URL());
		} else {
			const [orgName, repoName, issueNumber] = pathArray;
			setMintBountyState(VALID_URL(orgName, repoName, issueNumber));
		}
	}, [issueUrl]);

	useEffect(() => {
		if (mintBountyState.isValidUrl) {
			async function fetchIssue() {
				setIsLoadingIssueData(true);
				try {
					const data = await appState.githubRepository.fetchIssue(
						mintBountyState.orgName,
						mintBountyState.repoName,
						mintBountyState.issueNumber
					);
					setMintBountyState(
						ISSUE_FOUND(data.organization.repository.issue)
					);
					setIsLoadingIssueData(false);
				} catch (error) {
					setIsLoadingIssueData(false);
					setMintBountyState(ISSUE_NOT_FOUND(error));
					setMintBountyState(ISSUE_NOT_FOUND(error));
				}
			}
			fetchIssue();
		}
	}, [
		mintBountyState.issueNumber,
		mintBountyState.orgName,
		mintBountyState.repoName,
	]);

	useEffect(() => {
		if (mintBountyState.issueData) {
			async function alreadyExists() {
				try {
					let bounty = await appState.openQSubgraphClient.getBountyByBountyId(
						mintBountyState.issueData.id
					);
					if (bounty) {
						setMintBountyState(BOUNTY_EXISTS(bounty));
					} else {
						setMintBountyState(BOUNTY_DOES_NOT_EXIST());
					}
				} catch (error) {
					setMintBountyState(ERROR(error));
				}
			}

			alreadyExists();
		}
	}, [mintBountyState.issueData]);

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
				mintBountyState.orgName
			);

			let bountyId = null;
			while (bountyId == 'undefined') {
				const bountyResp = await appState.openQSubgraphClient.getBounty(bountyAddress);
				bountyId = bountyResp?.bountyId;
				await sleep(500);
			}

			await sleep(1000);


			router.push(
				`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bountyAddress}?first=true`
			);
		} catch (error) {
			console.log('error in mintbounty', error);
			const { message, title } = appState.openQClient.handleError(error);
			setMintBountyState(TRANSACTION_FAILURE({ message, title }));
		}
	}

	// Render
	return (
		<div>
			<div className="flex justify-center items-center font-mont overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-5">
				<div className="md:w-1/2 lg:w-1/3 xl:w-1/4 space-y-5">
					<div ref={menuRef} className="w-full">
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
								<div className="pl-10 pt-5">
									<LoadingIcon bg={'white'} />
								</div>
							) : null}
							{isValidUrl && !issueFound && !isLoadingIssueData ? (
								<div className="pl-10 pt-5 text-white">
									Github Issue not found
								</div>
							) : null}
							<div className="flex flex-row justify-center space-x-1 px-8">
								{isValidUrl && issueClosed && issueFound ? (
									<div className="pt-3 text-white">
										This issue is already closed on GitHub
									</div>
								) : null}
								{isValidUrl && bountyAddress && issueFound ? (
									<BountyAlreadyMintedMessage bountyAddress={bountyAddress} />
								) : null}
							</div>

							<div className="flex items-center justify-center p-5 rounded-b w-full">
								<MintBountyModalButton
									mintBounty={mintBounty}
									enableMint={enableMint}
									transactionPending={transactionPending}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{error && (
				<ErrorModal
					setShowErrorModal={setShowErrorModal}
					error={error}
				/>
			)}
			<div className="bg-overlay fixed inset-0 z-10"></div>
		</div>
	);
};

export default MintBountyModal;
