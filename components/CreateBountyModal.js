// Third Party
import React, { useEffect, useState, useContext, useRef } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
// Custom
import useWeb3 from '../hooks/useWeb3';
import StoreContext from '../store/Store/StoreContext';
import LoadingIcon from './tools/LoadingIcon';
import BountyMintedNotification from './tools/notifications/BountyMintedNotification';

const CreateBountyModal = (props) => {
	//props
	const modalVisibility = props.modalVisibility;

	// Context
	const [appState] = useContext(StoreContext);
	const { library } = useWeb3();

	// State
	const [issueUrl, setIssueUrl] = useState('');
	const [orgName, setOrgName] = useState('');
	const [repoName, setRepoName] = useState('');
	const [issueNumber, setIssueNumber] = useState(0);
	const [issueId, setIssueId] = useState('');
	const [issueFound, setIssueFound] = useState(false);
	const [issueClosed, setIssueClosed] = useState(false);
	const [, setError] = useState(false);
	const [, setErrorMessage] = useState(null);

	const [issueData, setIssueData] = useState('');
	const [bountyAddress, setBountyAddress] = useState(null);

	const [isValidUrl, setIsValidUrl] = useState(false);
	const [displayLoader, setDisplayLoader] = useState(true);
	const [disableMint, setDisableMint] = useState(true);
	const [, setBountyExists] = useState(false);
	const [transactionPending, setTransactionPending] = useState(false);
	const [isBountyMinted, setIsBountyMinted] = useState(false);

	let menuRef = useRef();
	let notifyMenuRef;

	// Methods
	async function fetchIssue() {
		try {
			const response = await appState.githubRepository.fetchIssue(
				orgName,
				repoName,
				issueNumber
			);
			setIssueFound(true);
			setDisplayLoader(false);

			if (response.data.organization.repository.issue.closed) {
				setIssueClosed(true);
				setDisableMint(true);
			} else {
				setIssueClosed(false);
				setDisableMint(false);
			}
			setIssueData(response.data.organization.repository.issue);
			setIssueId(response.data.organization.repository.issue.id);
		} catch (e) {
			setError(true);
			setErrorMessage(e.message);
			setIssueFound(false);
			setDisplayLoader(false);
			setIssueData(null);
			setDisableMint(true);
		}
	}

	async function alreadyExists() {
		const address = await getBountyAddress(issueData.id);
		// Solidity returns the default zero address for uninitiated members of a mapping
		if (address == '0x0000000000000000000000000000000000000000') {
			setBountyExists(false);
			if (!issueClosed) {
				setDisableMint(false);
			}
			setBountyAddress(null);
		} else {
			setBountyExists(true);
			setBountyAddress(address);
			setDisableMint(true);
		}
	}

	// Hooks

	//Close Modal on outside click
	useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				console.log('isBountyMinted: ', isBountyMinted);
				if (isBountyMinted) {
					if (!notifyMenuRef.current.contains(event.target)) {
						updateModal();
						setIsBountyMinted(false);
					}
				} else {
					updateModal();
				}
			}
			/* if (!notifyMenuRef.current.contains(event.target)) {
				updateModal();
				setIsBountyMinted(false);
			} */
		};
		window.addEventListener('mousedown', handler);

		return () => {
			window.removeEventListener('mousedown', handler);
		};
	});

	// Parse the Organization name, Repository Name and Issue number from the URL
	// This is needed to fetch the globally unique issue id
	useEffect(() => {
		setError(false);
		setErrorMessage(null);

		let pathArray = appState.utils.parseGitHubUrl(issueUrl);
		if (pathArray == null) {
			setIsValidUrl(false);
			setDisableMint(true);
			setBountyExists(false);
		} else {
			const [orgName, repoName, issueNumber] = pathArray;
			setOrgName(orgName);
			setRepoName(repoName);
			setIssueNumber(issueNumber);
			setIsValidUrl(true);

			setDisableMint(false);
		}
	}, [issueUrl]);

	// Only runs when parseGitHubUrl succeeds
	useEffect(() => {
		if (isValidUrl) {
			fetchIssue();
		}
	}, [issueNumber]);

	useEffect(() => {
		if (issueData) {
			alreadyExists();
		}
	}, [issueData]);

	// Methods
	const updateModal = () => {
		modalVisibility(false);
	};

	const passNotificationRef = (data) => {
		notifyMenuRef = data;
	};

	const getDate = () => {
		const rawDate = issueData.createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(' ').slice(1).join(' ');
	};

	async function getBountyAddress(id) {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = appState.openQClient.OpenQ(provider);

			try {
				const bountyAddress = await contract.getBountyAddress(id);
				return bountyAddress;
			} catch (e) {
				setError(true);
				setErrorMessage(e.message);
			}
		}
	}

	async function mintBounty() {
		try {
			setDisableMint(true);
			setError(false);

			setTransactionPending(true);
			const { issueAddress } = await appState.openQClient.mintBounty(
				library,
				issueId
			);

			setBountyAddress(issueAddress);
			setTransactionPending(false);
			setIsBountyMinted(true);
		} catch (e) {
			setError(true);
			setErrorMessage(e.message);
			setTransactionPending(false);
			setDisableMint(false);
		}
	}

	// Render
	return (
		<div>
			<div className="flex flex-col justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				{isBountyMinted ? (
					<div>
						<BountyMintedNotification
							passRef={passNotificationRef}
							address={bountyAddress}
							issueUrl={issueUrl}
							notifyModalVisibility={setIsBountyMinted}
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
									<div className=" bg-gray-100 font-normal text-gray-600">
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
								{isValidUrl && issueData ? (
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
											<div className="text-sm"> {issueData.title}</div>
										</div>
										<div className="text-xs pt-3 pl-6 text-gray-400">
											{' '}
											created at {getDate()} by {issueData.author.login}
										</div>
									</div>
								) : null}
							</div>
						</div>
						{/* {error ? errorMessage : null} */}
						{isValidUrl && !issueFound && displayLoader ? (
							<div className="pl-10 pt-5">
								<LoadingIcon bg={'white'} />
							</div>
						) : null}
						{isValidUrl && !issueFound && !displayLoader ? (
							<div className="pl-10 pt-5">Github Issue not found</div>
						) : null}
						<div className="flex flex-row justify-center space-x-1 px-8">
							{isValidUrl && issueClosed && issueFound ? (
								<div className="pt-3">
									This issue is already closed on GitHub
								</div>
							) : null}
							{isValidUrl && bountyAddress && issueFound ? (
								<>
									<div className="pt-3">Bounty is already minted, top up</div>
									<Link
										href={`/?address=${bountyAddress}}`}
										as={`/bounty/${bountyAddress}`}
									>
										<a
											target="_blank"
											rel="noreferrer"
											className="cursor-pointer text-link pt-3"
										>
											here.
										</a>
										{/*  <a target="_blank" rel="noreferrer">
                      <div id={"bounty-link"} className="cursor-pointer">
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
                    </a> */}
									</Link>
								</>
							) : null}
						</div>

						<div className="flex items-center justify-center p-5 rounded-b w-full">
							{transactionPending ? (
								<button
									className={`
									flex flex-row space-x-2 justify-center
									${disableMint
									? 'confirm-btn-disabled cursor-not-allowed'
									: 'confirm-btn cursor-pointer'
								}`}
									type="button"
									onClick={() => mintBounty()}
									disabled={disableMint}
								>
									<LoadingIcon bg="colored" /> Mint Bounty
								</button>
							) : (
								<button
									className={`${disableMint
										? 'confirm-btn-disabled cursor-not-allowed'
										: 'confirm-btn cursor-pointer'
									}`}
									type="button"
									onClick={() => mintBounty()}
									disabled={disableMint}
								>
									Mint Bounty
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default CreateBountyModal;
