// Third party
import React from 'react';

// Custom
import AboutFunding from './AboutFunding';

const About = ({ organizationData, tokenValues }) => {
	console.log(organizationData);
	const bounties = organizationData.bountiesCreated.filter((elem) => {
		return elem.status === 'OPEN';
	});

	const numBounties = bounties.length;
	const users = [];

	organizationData.payouts.forEach((elem) => {
		if (!users.some(userElem => userElem.payoutAddress === elem.payoutAddress)) {
			users.push(elem);
		}
	});

	return (
		<div className='lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center justify-items-center mx-8 pt-12'>
			<section className="min-h-card rounded-lg shadow-sm col-start-2 border border-web-gray w-full max-w-screen-lg">
				<h1 className='font-semibold p-4 text-3xl border-web-gray border-b'>{organizationData.login}</h1>
				<dl className="p-10 pb-0">
					<dt className='font-semibold text-gray-300 text-lg pb-2'>Bounties</dt>
					<dd className='font-semibold pb-8'>{numBounties}</dd>
					<dt className='font-semibold text-gray-300 text-lg pb-2'>Contributors</dt>
					<dd className='font-semibold pb-8'>{users.length}</dd>
					<AboutFunding organizationFunding={organizationData.fundedTokenBalances} tokenValues={tokenValues} />
				</dl>
			</section>
		</div >
	);
};
export default About;