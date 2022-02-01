// Third Party
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Custom

const BountyContributors = ({ bounty }) => {

	const [contributors, setContributors] = useState({});

	useEffect(() => {
		let contribs = {};
		bounty.deposits.forEach(deposit => {
			contribs[deposit.sender.id] = deposit.volume;
		});

		setContributors(contribs);
	}, []);

	return (
		<>
			<div className="font-bold text-xl">Contributors</div>
			<div>Total: {Object.keys(contributors).length}</div>
			<br />
			{/*Each contributor account should be clickable so people can see other things they've funded, bounties created, etc. more social*/}
			{Object.keys(contributors).map(contributor => {
				return (
					<Link href={`/user/${contributor}`} key={contributor}>
						{contributor}
					</Link>
				);
			})}
		</>
	);
};

export default BountyContributors;
