// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCard/BountyCardDetails';
import FundBounty from '../../components/FundBounty/FundBounty';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [bounty, setBounty] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [tokenValues, setTokenValues] = useState({});

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounty = await appState.openQSubgraphClient.getBounty(address.toLowerCase());

		const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty(mergedBounty);
	}

	// Hooks
	useEffect(() => {
		if (address) {
			populateBountyData();
		}
	}, [address]);

	// Refactor this hook our to be shared
	useEffect(async () => {
		if (bounty != null) {
			let tokenVolumes = {};

			bounty.bountyTokenBalances.map((tokenBalance) => {
				// REAL
				// tokenVolumes[deposit.tokenAddress.toLowerCase()] = deposit.value;

				console.log(tokenBalance);
				// MOCK
				tokenVolumes['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'] = tokenBalance.volume;
				tokenVolumes['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'] = tokenBalance.volume;
			});

			const data = { tokenVolumes };
			const url = appState.coinApiBaseUrl + '/tvl';

			//only query tvl for bounties that have deposits
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				await axios
					.post(url, data)
					.then((result) => {
						// FOR NOW JUST REASSIGN THE PRICES from other coin to FAKE and MOCK
						let foo = { ...result.data };
						foo['tokens']['0x5fbdb2315678afecb367f032d93f642f64180aa3'] = result.data.tokens['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'];
						foo['tokens']['0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'] = result.data.tokens['0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39'];
						setTokenValues(foo);
						setIsLoading(false);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setTokenValues({});
			}
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
								tokenValues={tokenValues}
							/>
						</div>
						<FundBounty address={address} />
					</div>
				</div>
			</div >
		);
	}
};

export default address;
