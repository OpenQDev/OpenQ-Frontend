// Third Party
import React, { useEffect, useState, useContext, useRef } from 'react';
import Link from 'next/link';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import BountyMintedNotification from './BountyMintedNotification';
import MintBountyContext from './MintBountyStore/MintBountyContext';

const MintBountyModal = ({ modalVisibility }) => {
	// Context
	const [appState] = useContext(StoreContext);
	const [mintBountyState, setMintBountyState] = useContext(MintBountyContext);
	const { library } = useWeb3();

	const RESTING_STATE = () => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const BOUNTY_DOES_NOT_EXIST = () => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const ISSUE_FOUND = (issue) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const VALID_URL = (orgName, repoName, issueNumber) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber,
			issueUrl: '',
			orgName,
			repoName,
			transactionPending: false
		};
	};

	const INVALID_URL = () => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const BOUNTY_EXISTS = (bounty) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const ERROR = (error) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const TRANSACTION_PENDING = () => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const TRANSACTION_SUCCESS = (bountyAddress) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const TRANSACTION_FAILURE = (error) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const ISSUE_NOT_FOUND = (error) => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	const BOUNTY_MINTED = () => {
		return {
			bounty: null,
			bountyAddress: '',
			bountyExists: false,
			enableMint: false,
			error: false,
			errorMessage: '',
			isBountyMinted: false,
			isLoading: false,
			isValidUrl: false,
			issueClosed: false,
			issueData: '',
			issueFound: false,
			issueId: '',
			issueNumber: '',
			issueUrl: '',
			orgName: '',
			repoName: '',
			transactionPending: false
		};
	};

	// State
	// GitHub Issue State
	const [issueUrl, setIssueUrl] = useState('');

	// Refs
	let menuRef = useRef();
	let notifyMenuRef;

	// Hooks
	useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				if (mintBountyState.isBountyMinted) {
					if (!notifyMenuRef.current.contains(event.target)) {
						modalVisibility(false);
						setMintBountyState(BOUNTY_MINTED());
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

	useEffect(() => {
		setMintBountyState(RESTING_STATE);

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
			fetchIssue();
		}
	}, [mintBountyState.issueNumber]);

	useEffect(() => {
		if (mintBountyState.issueData) {
			alreadyExists();
		}
	}, [mintBountyState.issueData]);

	// Methods
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

	async function alreadyExists() {
		let bounty = null;

		try {
			bounty = await appState.openQSubgraphClient.getBounty(mintBountyState.issueData.id);
			if (bounty) {
				setMintBountyState(BOUNTY_EXISTS(bounty));
			} else {
				setMintBountyState(BOUNTY_DOES_NOT_EXIST());
			}

		} catch (error) {
			setMintBountyState(ERROR(error));
		}
	}

	async function mintBounty() {
		try {
			setMintBountyState(TRANSACTION_PENDING());

			const { bountyAddress } = await appState.openQClient.mintBounty(
				library,
				mintBountyState.issueId,
				mintBountyState.orgName.toLowerCase()
			);

			setMintBountyState(TRANSACTION_SUCCESS(bountyAddress));
		} catch (error) {
			setMintBountyState(TRANSACTION_FAILURE(error));
		}
	}

	async function getBounty(bountyAddress) {
		try {
			const bounty = await appState.openQSubgraphClient.getBounty(bountyAddress.toLowerCase());
			setMintBountyState(BOUNTY_EXISTS(bounty));
		} catch (error) {
			setMintBountyState(ERROR(error));
		}
	}

	useEffect(() => {
		if (mintBountyState.bountyAddress) {
			getBounty(mintBountyState.bountyAddress);
		}
	}, [mintBountyState.bountyAddress]);

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
								{mintBountyState.isValidUrl && mintBountyState.issueData ? (
									<div className="flex flex-col pt-4 pl-5 ">
										<div className="flex flex-grow flex-row items-center space-x-2">
											<div className="">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="#15FB31"
													viewBox="0 0 16 16"
													width="17"
													height="17"
												>
													<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
													<path
														fillRule="evenodd"
														d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
													></path>
												</svg>
											</div>
											<div className="text-sm"> {mintBountyState.issueData.title}</div>
										</div>
										<div className="text-xs pt-3 pl-6 text-gray-400">
											{' '}
											created at {appState.utils.formatDate(mintBountyState.issueData.createdAt)} by {mintBountyState.issueData.author.login}
										</div>
									</div>
								) : null}
							</div>
						</div>
						{/* {error ? errorMessage : null} */}
						{mintBountyState.isValidUrl && !mintBountyState.issueFound && mintBountyState.isLoading ? (
							<div className="pl-10 pt-5">
								<LoadingIcon bg={'white'} />
							</div>
						) : null}
						{mintBountyState.isValidUrl && !mintBountyState.issueFound && !mintBountyState.isLoading ? (
							<div className="pl-10 pt-5">Github Issue not found</div>
						) : null}
						<div className="flex flex-row justify-center space-x-1 px-8">
							{mintBountyState.isValidUrl && mintBountyState.issueClosed && mintBountyState.issueFound ? (
								<div className="pt-3">
									This issue is already closed on GitHub
								</div>
							) : null}
							{mintBountyState.isValidUrl && mintBountyState.bountyAddress && mintBountyState.issueFound ? (
								<>
									<div className="pt-3">Bounty is already minted, top up</div>
									<Link
										href={`/?address=${mintBountyState.bountyAddress}}`}
										as={`/bounty/${mintBountyState.bountyAddress}`}
									>
										<>
											<a
												target="_blank"
												rel="noreferrer"
												className="cursor-pointer text-link pt-3"
											>
												here.
											</a>
											<a target="_blank" rel="noreferrer">
												<div id={'bounty-link'} className="cursor-pointer">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="#383838"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
														/>
													</svg>
												</div>
											</a>
										</>
									</Link>
								</>
							) : null}
						</div>
						<div className="flex items-center justify-center p-5 rounded-b w-full">
							<button
								className={`${!mintBountyState.enableMint
									? 'confirm-btn-disabled cursor-not-allowed'
									: 'confirm-btn cursor-pointer'
									}`}
								type="button"
								onClick={() => mintBounty()}
								disabled={!mintBountyState.enableMint}
							>
								{mintBountyState.transactionPending ? <LoadingIcon bg="colored" /> : null}Mint Bounty
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default MintBountyModal;
