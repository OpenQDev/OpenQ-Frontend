import React from 'react';
import TokenBalances from '../TokenBalances/TokenBalances';

const AboutFunding = ({ organizationFunding, tokenValues }) => {
	return (<div className="w-60 pb-8">
		<dt>
			<ul>
				<TokenBalances
					tokenBalances={organizationFunding}
					tokenValues={tokenValues}
					header={'Current Total Value Locked'}
					singleCurrency={false}
				/>
			</ul>
		</dt>
	</div>);
};
export default AboutFunding;