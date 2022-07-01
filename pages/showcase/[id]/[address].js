// Third party
import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import StoreContext from '../../../store/Store/StoreContext';
import ShowCasePage from '../../../components/ShowCase/ShowCasePage';

const showcasePR = () => {
	const router = useRouter();
	const {id, address} = router.query;
	const [appState] = useContext(StoreContext);
	const [pr, setPr] = useState();
	// Render
	const [bounty, setBounty]= useState();
	useEffect(async()=>{
		if(id){	
			const fetchedPr =	await appState.githubRepository.getPrById(id);
			const bounty = await appState.openQSubgraphClient.getBounty(address);
			setBounty(bounty);
			setPr(fetchedPr);
		}}
	,[id]	);

	return (<>
		{
			pr&&bounty&&	<ShowCasePage bounty={bounty} pr={pr}/>
		}</>
		
	);

};


export default showcasePR;
