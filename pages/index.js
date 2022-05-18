// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';

import GithubRepository from '../services/github/GithubRepository';
import OpenQSubgraphClient from '../services/subgraph/OpenQSubgraphClient'

export async function getServerSideProps(context) {
	let orgs = [];
	const githubRepository = new GithubRepository()
	const openQSubgraphClient = new OpenQSubgraphClient()
	
	try {
		orgs = await openQSubgraphClient.getOrganizations();
	} catch (error) {
		console.log(error);
	}
	
	const ids = orgs.map(org => org.id);
	let githubOrganizations = [];
	
	try {
		githubOrganizations = await githubRepository.fetchOrgsOrUsersByIds(ids);
	} catch (err) {
		console.log(err);
	}

	let mergedOrgs = orgs.map((org) => {
		let currentGithubOrg;
		for (const githubOrganization of githubOrganizations) {
			if (org.id === githubOrganization.id) {
				currentGithubOrg = githubOrganization;
			}
		}
		return { ...org, ...currentGithubOrg };
	});

	return { props: { organizations: mergedOrgs } }
}

export default function Index({ organizations }) {
	console.log('organizations', organizations)
	const [internalMenu, setInternalMenu] = useState('org');
	const batch = 10;
	// State
	const [bounties, setBounties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const [complete, setComplete] = useState(false);
	const [pagination, setPagination] = useState(batch);

	// Context
	const [appState] = useContext(StoreContext);

	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		try {
			setComplete(true);
			const newBounties = await appState.openQSubgraphClient.getAllBounties('desc', 0, batch);

			const bountyIds = newBounties.map((bounty) => bounty.bountyId);
			let issueData;
			issueData = await appState.githubRepository.getIssueData(bountyIds);

			const fullBounties = [];
			newBounties.forEach((bounty) => {
				const relatedIssue = issueData.find(
					(issue) => issue.id == bounty.bountyId
				);
				const mergedBounty = { ...bounty, ...relatedIssue };
				fullBounties.push(mergedBounty);
			});
			setBounties(fullBounties);
			if (batch === fullBounties.length) {
				setComplete(false);
			}
			setIsLoading(false);
		}
		catch (error) {
			console.log(error);
			setError(true);
			return;
		}
	}


	async function getBountyData(sortOrder, currentPagination) {
		setPagination(() => currentPagination + batch);
		const newBounties = await appState.openQSubgraphClient.getAllBounties(sortOrder, currentPagination, batch);
		const bountyIds = newBounties.map((bounty) => bounty.bountyId);
		const issueData = await appState.githubRepository.getIssueData(bountyIds);
		const fullBounties = [];
		newBounties.forEach((bounty) => {
			const relatedIssue = issueData.find(
				(issue) => issue.id == bounty.bountyId
			);
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		});
		return fullBounties;
	}

	async function getNewData(order) {
		setIsLoading(true);
		setComplete(false);
		const newBounties = await getBountyData(order, 0);
		setBounties(newBounties);
		setIsLoading(false);
	}

	async function getMoreData(order) {
		setComplete(true);
		const newBounties = await getBountyData(order, pagination);
		if (newBounties.length === batch) {
			setComplete(false);
		}
		setBounties(bounties.concat(newBounties));


	}

	return (
		<div>
			<main>
				<div className="bg-dark-mode pt-10 flex-col">
					<div className="flex justify-center pb-8">
						<div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
							<button
								onClick={() => setInternalMenu('org')}
								className={` rounded-xl p-2 px-4 ${internalMenu == 'org' ? 'bg-inactive-gray' : null
								}`}
							>
								Organizations
							</button>
							<button
								onClick={() => setInternalMenu('issue')}
								className={` rounded-xl p-2 px-4 ${internalMenu == 'issue' ? 'bg-inactive-gray' : null
								}`}
							>
								Issues
							</button>
						</div>
					</div>
					<div>
						{internalMenu == 'org' ? <OrganizationHomepage organizations={organizations} /> : <BountyHomepage bounties={bounties} loading={isLoading} error={error} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />}
					</div>
				</div>
			</main>
		</div>
	);
}
