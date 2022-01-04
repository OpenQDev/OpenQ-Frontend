// Third Party
import React, { useEffect, useState, useContext, useRef } from 'react';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import BountyMintedNotification from './BountyMintedNotification';
import MintBountyContext from './MintBountyStore/MintBountyContext';
import {
	RESTING_STATE,
	BOUNTY_DOES_NOT_EXIST,
	ISSUE_FOUND,
	VALID_URL,
	INVALID_URL,
	BOUNTY_EXISTS,
	ERROR,
	TRANSACTION_PENDING,
	TRANSACTION_SUCCESS,
	TRANSACTION_FAILURE,
	ISSUE_NOT_FOUND
} from './States';
import MintBountyMessages from './MintBountyMessages';
import IssueDetailsBubble from './IssueDetailsBubble';

const MintBountyModal = ({ modalVisibility }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const [mintBountyState, setMintBountyState] = useContext(MintBountyContext);
	const { library } = useWeb3();

	// State
	// GitHub Issue State
	const [issueUrl, setIssueUrl] = useState('');

	// Refs
	let menuRef = useRef();
	let notifyMenuRef;

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
				try {
					const response = await appState.githubRepository.fetchIssue(
						mintBountyState.orgName,
						mintBountyState.repoName,
						mintBountyState.issueNumber
					);
					setMintBountyState(ISSUE_FOUND(response.data.organization.repository.issue));
				} catch (error) {
					setMintBountyState(ISSUE_NOT_FOUND(error));
				}
			}
			fetchIssue();
		}
	}, [mintBountyState.issueNumber, mintBountyState.orgName, mintBountyState.repoName]);

	useEffect(() => {
		if (mintBountyState.issueData) {

			async function alreadyExists() {
				try {
					let bounty = await appState.openQSubgraphClient.getBountyByBountyId(mintBountyState.issueData.id);
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
	async function mintBounty() {
		try {
			setMintBountyState(TRANSACTION_PENDING());

			const { bountyAddress } = await appState.openQClient.mintBounty(
				library,
				mintBountyState.issueId,
				mintBountyState.orgName
			);

			setMintBountyState(TRANSACTION_SUCCESS(bountyAddress));
		} catch (error) {
			setMintBountyState(TRANSACTION_FAILURE(error));
		}
	}

	// Render
	return (
		<div>
			<div className="flex flex-col justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				{mintBountyState.isBountyMinted ? (
					<div>
						<BountyMintedNotification
							notificationRef={(data) => { notifyMenuRef = data; }}
							bountyAddress={mintBountyState.bountyAddress}
							issueUrl={issueUrl}
							notifyModalVisibility={mintBountyState.setIsBountyMinted}
						/>
					</div>
				) : null}
				<div ref={menuRef} className="w-2/7 my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-xl shadow-lg flex flex-col bg-white outline-none focus:outline-none">
						<div className="flex flex-col items-center justify-center p-5 rounded-t">
							<h3 className="text-3xl text-gray-700 font-semibold">
								Mint Bounty
							</h3>
							<h3 className="text-2xl pt-3 w-2/3 text-center text-gray-300">
								Create a Bounty to send funds to any GitHub Issue
							</h3>
						</div>
						<div className="flex flex-col pl-6 pr-6 space-y-2">
							<div className="border-gray-100 border-2 rounded-lg">
								<div className="flex flex-row items-center p-2  rounded-lg py-1 text-base bg-gray-100 shadow-inner text-white">
									<div className="bg-gray-100 font-normal text-gray-600">
										<input
											className="bg-gray-100 box-content xl:w-80 lg:w-64 md:w-44 sm:w-32 w-18 border-gray-100 outline-none"
											id="name"
											placeholder="Issue URL"
											autoComplete="off"
											type="text"
											onChange={(event) => {
												setIssueUrl(event.target.value);
											}}
										/>
									</div>
								</div>
								<IssueDetailsBubble mintBountyState={mintBountyState} />
							</div>
						</div>
						<MintBountyMessages mintBountyState={mintBountyState} />
					</div>
					<div className="flex items-center justify-center p-5 rounded-b w-full">
						<button
							className={`${mintBountyState.enableMint ? 'confirm-btn cursor-pointer' : 'confirm-btn-disabled cursor-not-allowed'}`}
							type="button"
							onClick={() => mintBounty()}
							disabled={!mintBountyState.enableMint}
						>
							{mintBountyState.transactionPending ? <LoadingIcon bg="colored" /> : null}Mint Bounty
						</button>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default MintBountyModal;
