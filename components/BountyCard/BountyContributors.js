// Third Party
import React, { useEffect, useState } from 'react';

// Custom

const BountyContributors = (props) => {
	const { bounty } = props;

	const [contributors, setContributors] = useState({});

	useEffect(() => {
		let contribs = {};
		bounty.deposits.forEach(deposit => {
			contribs[deposit.sender.id] = deposit.value;
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
				return contributor;
			})}
		</>
	);
};

export default BountyContributors;
