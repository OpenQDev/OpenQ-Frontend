import { useEffect, useState, useContext } from 'react';
import StoreContext from '../store/Store/StoreContext';
import CopyAddressToClipboard from './tools/CopyAddressToClipboard';
import { ethers } from 'ethers';

const CreateBountyModal = (props) => {
	// Context
	const [appState, setAppState] = useContext(StoreContext);

	// State
	const [issueUrl, setIssueUrl] = useState('');
	const [orgName, setOrgName] = useState('');
	const [repoName, setRepoName] = useState('');
	const [issueNumber, setIssueNumber] = useState(0);
	const [issueId, setIssueId] = useState('');

	const [issueData, setIssueData] = useState('');
	const [bountyAddress, setBountyAddress] = useState(null);

	const [isValidUrl, setIsValidUrl] = useState(false);
	const [disableMint, setDisableMint] = useState(true);
	const [bountyExists, setBountyExists] = useState(false);

	// Hooks

	// Parse the Organization name, Repository Name and Issue number from the URL
	// This is needed to fetch the globally unique issue id
	useEffect(() => {
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
		}
	}, [issueUrl]);

	// Only runs when parseGitHubUrl succeeds
	useEffect(() => {
		if (isValidUrl) {
			async function fetchIssue() {
				const response = await appState.githubRepository.fetchIssue(
					orgName,
					repoName,
					issueNumber
				);
				setIssueData(response.data.organization.repository.issue);
			}
			fetchIssue();
		}
	}, [issueNumber]);

	useEffect(() => {
		if (issueData) {
			async function alreadyExists() {
				const address = await getBountyAddress(issueData.id);
				if (address == '0x0000000000000000000000000000000000000000') {
					setBountyExists(false);
					setDisableMint(false);
					setBountyAddress(null);
				} else {
					setBountyExists(true);
					setBountyAddress(address);
					setDisableMint(true);
				}
			}
			alreadyExists();
		}
	}, [issueData]);

	// Methods
	const updateModal = () => {
		props.modalVisibility(false);
	};

	async function requestAccount() {
		await window.ethereum?.request({ method: 'eth_requestAccounts' });
	}

	const getDate = () => {
		const rawDate = issueData.createdAt;
		const date = new Date(rawDate);
		return date.toDateString().split(' ').slice(1).join(' ');
	};

	async function getBountyAddress(id) {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = appState.openQClient.OpenQ(
				provider
			);

			try {
				const bountyAddress = await contract.getBountyAddress(id);
				return bountyAddress;
			} catch (err) {
				console.log('getBountyAddress Error: ', err);
			}
		}
	}

	async function mintBounty(id) {
		if (typeof window.ethereum !== 'undefined') {
			const resp = await appState.githubRepository.fetchIssue(
				orgName,
				repoName,
				issueNumber
			);
			const globalIssueId = resp.data.organization.repository.issue.id;

			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = appState.openQClient.OpenQ(
				appState.openQAddress,
				signer
			);

			try {
				const transaction = await contract.mintBounty(globalIssueId);
				await transaction.wait();
				const address = await getBountyAddress(globalIssueId);
				setBountyAddress(address);
				setDisableMint(true);
			} catch (error) {
				if (
					error?.data?.message.includes('Issue already exists for given id')
				) {
					alert('Issue already exists');
				}
				console.log(error);
			}
		}
	}

	// Render
	return (
		<div>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-2/7 my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-xl shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
						<div className="flex items-center justify-end">
							<button
								className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => updateModal()}
							>
								Close
							</button>
						</div>
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
								<div className="flex flex-row space-x-2 items-center p-2 font-mont rounded-lg py-1 text-base cursor-pointer bg-gray-100 shadow-inner text-white">
									<button
										className="flex flex-row items-center font-mont rounded-lg px-4 py-2 text-base font-bold cursor-pointer bg-button-pink text-white hover:bg-pink-600 hover:text-white"
										type="button"
									>
										Bounty
									</button>
									<div className="font-mont bg-gray-100 font-normal text-gray-600">
										<input
											className="bg-gray-100 w-8/9 border-gray-100 outline-none"
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
									<div className="flex flex-col pb-3 pt-4 pl-5 font-mont">
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
											<div className="text-sm">
												{' '}
												{issueData.title}
											</div>
										</div>
										<div className="text-xs pt-3 pl-6 text-gray-400">
											{' '}
											created at {getDate()} by{' '}
											{issueData.author.login}
										</div>
									</div>
								) : null}
							</div>
						</div>
						<div className="pt-5 px-8 cursor-pointer">
							{isValidUrl && bountyAddress ? (<div>Bounty Already Minted at:<CopyAddressToClipboard data={bountyAddress} /></div>)
								: null}
						</div>

						<div className="flex items-center justify-center p-6 rounded-b w-full">
							<button
								className={`${disableMint ? 'confirm-btn-disabled' : 'confirm-btn'
									}`}
								type="button"
								onClick={() => mintBounty()}
								disabled={disableMint}
							>
								Mint Bounty
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default CreateBountyModal;
