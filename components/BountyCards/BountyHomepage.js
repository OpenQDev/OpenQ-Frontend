// Third Party
import React, { useEffect, useState, useContext } from 'react';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import BountyCard from './BountyCard';
import StoreContext from '../../store/Store/StoreContext';
import chainIdDeployEnvMap from '../WalletConnect/chainIdDeployEnvMap';

const BountyHomepage = () => {
	// State
	const [issueIds, setIssueIds] = useState([]);
	const [issueIdToAddress, setIssueIdToAddress] = useState({});
	const [issueData, setIssueData] = useState([]);
	const [issueClaimedMap, setIssueClaimedMap] = useState({});
	const [fundingData, setFundingData] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// Context
	const { library, chainId, active } = useWeb3();
	const [appState,] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		const isOnCorrectNetwork = chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'] == chainId;
		if (active && isOnCorrectNetwork) {
			populateBountyData();
		} else {
			setIsLoading(true);
		}
	}, [active, chainId]);

	useEffect(() => {
		if (issueIds) {
			getIssueClaimStatuses(issueIds);
		}
	}, [issueIds]);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const issues = await appState.openQClient.getAllIssues(library);
		setIssueIds(issues);

		const issueIdToAddresses = await appState.openQClient.getIssueAddresses(library, issues);
		setIssueIdToAddress(issueIdToAddresses);

		const issueData = await appState.githubRepository.getIssueData(issues);
		setIssueData(issueData);

		const fundingDataObject = await appState.openQClient.getIssueDeposits(library, issueIdToAddresses);

		setFundingData(fundingDataObject);
		setIsLoading(false);
	}

	async function getIssueClaimStatuses(issueIds) {
		let mapping = {};
		for (let issueId of issueIds) {
			const isOpen = await appState.openQClient.getIssueIsOpen(library, issueId);
			mapping[issueId] = !isOpen;
		}
		setIssueClaimedMap(mapping);
	}

	// Render
	if (isLoading) {
		return <div>Loading...</div>;
	} else {
		return (
			<>
				<div className="grid grid-cols-1 gap-6 pr-20">
					{issueData.map((issue) => {
						return (
							<BountyCard
								isClaimed={issueClaimedMap[issue.id]}
								issue={issue}
								address={issueIdToAddress[issue.id]}
								deposits={fundingData[issue.id]}
								key={issue.id}
							/>
						);
					})}
				</div>
			</>
		);
	}
};

export default BountyHomepage;
