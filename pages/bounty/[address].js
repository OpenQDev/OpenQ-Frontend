// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCards/BountyCardDetails';

const address = () => {
	// Context
	const { library, active } = useWeb3();
	const [appState,] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [issueId, setIssueId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [fundingData, setFundingData] = useState([]);
	const [isClaimed, setIssueIsClaimed] = useState(true);
	const [issue, setIssue] = useState(null);

	// Methods
	async function getIssueId() {
		const issueId = await appState.openQClient.getIssueIdFromAddress(library, address);
		setIssueId(issueId);
	}

	async function getIssueIsOpen() {
		const isOpen = await appState.openQClient.getIssueIsOpen(library, issueId);
		setIssueIsClaimed(!isOpen);
	}

	async function getIssueData() {
		try {
			const response = await appState.githubRepository.fetchIssueById(issueId);
			setIssue(response);
		} catch (error) {
			console.log(error);
		}
	}

	async function getDeposits() {
		const issueIdToAddresses = { [issueId]: address };
		const fundingDataObject = await appState.openQClient.getIssueDeposits(library, issueIdToAddresses);
		setFundingData(fundingDataObject);
		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (address && active) {
			getIssueId();
		}
	}, [address, active]);

	useEffect(() => {
		if (issueId) {
			getIssueData();
			getIssueIsOpen();
		}
	}, [issueId]);

	useEffect(() => {
		if (issue) {
			getDeposits();
		}
	}, [issue]);

	// Render
	if (isLoading) {
		return 'Loading...';
	} else {
		return (
			<div>
				<div className="flex font-mont pt-7 justify-center items-center">
					<div className="">
						<div className="flex flex-col">
							<BountyCardDetails
								issue={issue}
								isClaimed={isClaimed}
								issueColor={Math.floor(Math.random() * 5)}
								deposits={fundingData[issueId]}
								address={address}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default address;
