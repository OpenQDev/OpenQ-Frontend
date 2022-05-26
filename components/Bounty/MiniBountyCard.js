// Third party
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';


import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
const MiniBountyCard = ({ bounty }) => {

	// Context
	const [appState] = useContext(StoreContext);

	// State
	const [title, updateTitle] = useState('');
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);

	//Hooks
	useEffect(async () => {
		const fetchedTitle = await appState.githubRepository.fetchIssueById(bounty.bountyId);
		updateTitle(fetchedTitle.title);
	}, [bounty]);

	return (
		<Link href={`/bounty/${bounty.id}?id=${bounty.bountyId}`}>
			<div className="border-inactive-accent hover:border-active-accent hover:bg-active-gray bg-inactive-gray border rounded-lg px-6 py-2 my-4 cursor-pointer" >
				<div className="">{title}</div>

				{tokenValues
					? `${appState.utils.formatter.format(tokenValues.total)}`
					: `${appState.utils.formatter.format(0)}`}
			</div>
		</Link>
	);
};

export default MiniBountyCard;
