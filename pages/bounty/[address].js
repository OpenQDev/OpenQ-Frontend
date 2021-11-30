// Third Party
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import BountyCardDetails from '../../components/BountyCards/BountyCardDetails';

const address = () => {
	// Context
	const [appState] = useContext(StoreContext);
	const router = useRouter();

	// State
	const { address } = router.query;
	const [bounty, setBounty] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [tvl, setTvl] = useState(0);

	// Methods
	async function populateBountyData() {
		setIsLoading(true);

		const bounty = await appState.openQSubgraphClient.getBounty(address);

		const issueData = await appState.githubRepository.fetchIssueById(bounty.bountyId);

		const mergedBounty = { ...bounty, ...issueData };

		setBounty(mergedBounty);

		setIsLoading(false);
	}

	// Hooks
	useEffect(() => {
		if (address) {
			populateBountyData();
		}
	}, [address]);

	useEffect(async () => {
		if (bounty.deposits) {
			const deposits = bounty.deposits;
			let cleanedDeposits = {};
			deposits.map((d) => {
				let coin;
				if (d.tokenAddress == '0x5fbdb2315678afecb367f032d93f642f64180aa3') {
					coin = 'ethereum';
				} else if (d.tokenAddress == '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512') {
					coin = 'bitcoin';
				} else {
					coin = d.value;
				}
				cleanedDeposits[coin] = d.balance;
			});

			const data = cleanedDeposits;
			const url = appState.coinApiBaseUrl + '/tvl';

			//only query tvl for bounties that have deposits
			if (JSON.stringify(data) != '{}') {
				await axios
					.post(url, data)
					.then((result) => {
						setTvl(result.data.total);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	});

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
								totalDeposits={tvl.toFixed(2)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default address;
