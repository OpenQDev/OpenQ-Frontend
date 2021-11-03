import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import StoreContext from '../../store/Store/StoreContext';
import { useWeb3React } from '@web3-react/core';
import BountyCardDetails from '../../components/BountyCards/BountyCardDetails';

const address = () => {
	// Context
	const { library, active } = useWeb3React();
	const [appState,] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [issueId, setIssueId] = useState('');
	const [issueData, setIssueData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fundingData, setFundingData] = useState([]);

	// Methods
	async function getIssueId() {
		const issueId = await appState.openQClient.getIssueIdFromAddress(library, address);
		setIssueId(issueId);
	}

	async function getIssueData() {
		try {
			const response = await appState.githubRepository.fetchIssueById(issueId);
			setIssueData(response.data.node);
		} catch (error) {
			console.log(error);
		}
	}

	async function getDeposits() {
		const issueIdToAddresses = { [issueId]: address };
		const fundingDataObject = await appState.openQClient.getIssueDeposits(library, issueIdToAddresses);

		console.log(fundingDataObject[issueId]);

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
		}
	}, [issueId]);

	useEffect(() => {
		if (issueData) {
			getDeposits();
		}
	}, [issueData]);

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
								issueColor={Math.floor(Math.random() * 5)}
								orgName={issueData.repository.owner.login}
								issue={issueData}
								repoName={issueData.repository.name}
								issueName={issueData.title}
								avatarUrl={issueData.repository.avatarUrl}
								labels={issueData.labels.edges}
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
