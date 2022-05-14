import React, {useState, useEffect,  useContext} from 'react';
import {useRouter} from 'next/router';
import { jsPDF } from 'jspdf';
import StoreContext from '../../store/Store/StoreContext';

import Invoice from '../../components/Invoicing/Invoice';
import { add } from 'lodash';

const invoice = ()=>{
	const [appState] = useContext(StoreContext);
	const [bounty, setBounty] = useState();
	const router = useRouter();
	const {address} = router.query;
	async function populateBountyData() {
		let bounty = null;

		try {
			console.log(bounty);
			bounty = await appState.openQSubgraphClient.getBounty(address, 'no-cache');
			const issueData = await appState.githubRepository.fetchIssueById(bounty?.bountyId);

			const mergedBounty = { ...bounty, ...issueData };

			setBounty({ ...mergedBounty });
		}
		catch (error) {
			console.log(error);
			return;
		}
	}
	useEffect(()=>{
		populateBountyData();
	},[address]);

	return(<div>
		{bounty && <Invoice bounty={bounty} />}
	</div>);
};

export default invoice;