// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useWeb3 from '../../hooks/useWeb3';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCard/BountyCardDetails';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();
	const { library } = useWeb3();

	// State
	const { address } = router.query;
	const [bounty, setBounty] = useState(null);
	const [value, setValue] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [tokenValueMap, setTokenValueMap] = useState({});
	const [tokenVolumes, setTokenVolumes] = useState({});

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounty = await appState.openQSubgraphClient.getBounty(address.toLowerCase());
		console.log(bounty);

		const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty(mergedBounty);
	}

	async function approve() {
		const approved = await appState.openQClient.approve(library, address, "0x5FbDB2315678afecb367f032d93F642f64180aa3", value);
	}

	async function fundBounty() {
		const funded = await appState.openQClient.fundBounty(library, address.toLowerCase(), "0x5FbDB2315678afecb367f032d93F642f64180aa3", value);
	}

	// Hooks
	useEffect(() => {
		if (address) {
			populateBountyData();
		}
	}, [address]);

	useEffect(async () => {
		if (bounty != null) {
			let tokenVolumes = {};

			bounty.deposits.map((deposit) => {
				// REAL
				// tokenVolumes[deposit.tokenAddress.toLowerCase()] = deposit.value;

				// MOCK
				tokenVolumes['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'] = deposit.value;
				tokenVolumes['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'] = deposit.value;
			});

			setTokenVolumes(tokenVolumes);

			const data = { tokenVolumes };
			const url = appState.coinApiBaseUrl + '/tvl';

			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				await axios
					.post(url, data)
					.then((result) => {
						setTokenValueMap(result.data);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setTokenValueMap({});
			}
			setIsLoading(false);
		}
	}, [bounty]);

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
								bounty={bounty}
								tokenValueMap={tokenValueMap}
								tokenVolumes={tokenVolumes}
							/>
						</div>
						<input
							className="bg-pink-100 box-content xl:w-80 lg:w-64 md:w-44 sm:w-32 w-18 border-pink-100 outline-none"
							onChange={(event) => {
								setValue(event.target.value);
							}} />
						<br />
						<br />
						<button
							className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
							onClick={() => approve()}
						>Approve with Mock Token</button>
						<br />
						<button
							className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
							onClick={() => fundBounty()}
						>Fund with Mock Token</button>
					</div>
				</div>
			</div >
		);
	}
};

export default address;
