import React from 'react';
import TokenBalances from '../TokenBalances/TokenBalances';
import AboutFundingValue from './AboutFundingValue';

const AboutFunding = ({ organizationFunding, tokenValues }) => {
	return (<div className="w-60 pb-8">
		<dd className='font-semibold text-gray-300 text-lg pb-2'>Total Value Locked</dd>
		<dt>
			<ul>
				<TokenBalances
					tokenBalances={organizationFunding}
					tokenValues={tokenValues}
					claimed={true}
				/>
			</ul>
		</dt>
	</div>);
};
export default AboutFunding;