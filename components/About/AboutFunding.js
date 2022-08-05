// Third party
import React from 'react';

// Custom
import TokenBalances from '../TokenBalances/TokenBalances';

const AboutFunding = ({ organizationFunding, tokenValues }) => {
	return (<div className="w-60 pb-8">
		<dt>
			{organizationFunding.length !==0 && <ul>
				<TokenBalances
					tokenBalances={organizationFunding}
					tokenValues={tokenValues}
					header={'Current Total Value Locked'}
					singleCurrency={false}
				/>
			</ul>}
		</dt>
	</div>);
};
export default AboutFunding;