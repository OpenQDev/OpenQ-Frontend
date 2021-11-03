import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from "next/router";
import Image from "next/image";
import DisplayPrice from "../../components/BountyCards/BountyCardComps/DisplayPrice";
import StoreContext from '../../store/Store/StoreContext';
import { useWeb3React } from '@web3-react/core';
import BountyCardDetails from '../../components/BountyCards/BountyCardDetails';

const address = () => {
	// Context
	const { library, chainId, active } = useWeb3React();
	const [appState, dispatch] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [issueId, setIssueId] = useState('');
	const [issueData, setIssueData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Hooks
	useEffect(() => {
		if (address && active) {
			async function getIssueId() {
				const issueId = await appState.openQClient.getIssueIdFromAddress(library, address);
				console.log(issueId);
				setIssueId(issueId);
			}
			getIssueId();
		}
	}, [address, active]);

	useEffect(() => {
		if (issueId) {
			async function getIssueData() {
				try {
					const response = await appState.githubRepository.fetchIssueById(issueId);
					console.log(response);
					setIssueData(response.data.node);
					setIsLoading(false);
				} catch (error) {
					setIsLoading(false);
					console.log(error);
				}
			}
			getIssueData();
		}
	}, [issueId]);

	// Render
	if (isLoading) {
		return "Loading...";
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
								deposits={[]}
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
