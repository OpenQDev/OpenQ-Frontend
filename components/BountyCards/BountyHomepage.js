import BountyCard from './BountyCard';
import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import { useWeb3React } from '@web3-react/core';
import chainIdDeployEnvMap from '../WalletConnect/chainIdDeployEnvMap';

const BountyHomepage = () => {
	// State
	const [, setIssueIds] = useState([]);
	const [issueIdToAddress, setIssueIdToAddress] = useState({});
	const [issueData, setIssueData] = useState([]);
	const [fundingData, setFundingData] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// Context
	const { library, chainId, active } = useWeb3React();
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

		let issueClaimedMap = {};
		issues.forEach(async issue => {
			const isClaimed = await appState.openQClient.getIssueIsOpen(library, issue.id);
			console.log(isClaimed);
			issueClaimedMap[issue.id] = isClaimed;
		});

		setFundingData(fundingDataObject);
		setIsLoading(false);
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
								issue={issue}
								issueColor={Math.floor(Math.random() * 5)}
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
