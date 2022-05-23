// Third party
import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../store/Store/StoreContext';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import useWeb3 from '../hooks/useWeb3';

export default function Index() {
	const [internalMenu, setInternalMenu] = useState('org');
	const batch = 10;
	// State
	const [bounties, setBounties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const [complete, setComplete] = useState(false);
	const [pagination, setPagination] = useState(batch);
	const [watchedBounties, setWatchedBounties] = useState([]);

	// Context
	const [appState] = useContext(StoreContext);

	const {account} = useWeb3();
	// Hooks
	useEffect(() => {
		populateBountyData();
	}, []);

	useEffect(async()=>{
		if(account){
			try{
				const prismaBounties = await appState.openQPrismaClient.getUser(account);
				const watchedBountyAddresses = prismaBounties.watchedBounties.bounties.map(bounty=>bounty.contractAddress.toLowerCase());
				const subgraphBounties =  await appState.openQSubgraphClient.getBountiesByContractAddresses( watchedBountyAddresses);
				const githubIds = subgraphBounties.map(bounty=>bounty.bountyId);
				const githubBounties = await appState.githubRepository.getIssueData(githubIds);
				setWatchedBounties(subgraphBounties.map((bounty, index)=>{return {...bounty, ...githubBounties[index]};}));
			}
			catch(err){
				console.log('could not fetch watched bounties');
			}
		}
	}	, [account]);

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
				) || { id: '', title: '', body: '' };
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
			) || { id: '', title: '', body: '' };
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
						{internalMenu == 'org' ? <OrganizationHomepage /> : <BountyHomepage bounties={bounties} watchedBounties={watchedBounties} loading={isLoading} error={error} getMoreData={getMoreData} complete={complete} getNewData={getNewData} />}
					</div>
				</div>
			</main>
		</div>
	);
}
