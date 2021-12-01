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
						<FundBounty address={address} />
					</div>
				</div>
			</div >
		);
	}
};

export default address;
