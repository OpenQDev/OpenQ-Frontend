// Third Party
import React from 'react';

// Custom Party
import AboutFunding from './AboutFunding';

const AboutBody = ({ organizationData }) => {

	// Process Data
	const bounties = organizationData.bountiesCreated.filter((elem) => {
		return elem.status === 'OPEN';
	}).length;

	const users = [];

	organizationData.payouts.forEach((elem) => {
		if (!users.some(userElem => userElem.payoutAddress === elem.payoutAddress)) {
			users.push(elem);
		}

	});
	return (
		<section className="min-h-card rounded-lg shadow-sm col-start-2 border border-web-gray">
			<h1 className='font-semibold p-4 text-3xl border-web-gray border-b'>{organizationData.login}</h1>
			<dl className="p-10 pb-0">
				<dt className='font-semibold text-gray-300 text-lg pb-2'>Bounties</dt>
				<dd className='font-semibold pb-8'>{bounties}</dd>
				<dt className='font-semibold text-gray-300 text-lg pb-2'>Contributors</dt>
				<dd className='font-semibold pb-8'>{users.length}</dd>
				<AboutFunding activeFunding={organizationData.fundedTokenBalances} />
			</dl>

		</section>
	);
};
export default AboutBody;