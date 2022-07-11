// Third Party
import React from 'react';

// Custom
import TokenBalances from '../../TokenBalances/TokenBalances';

const Balances = ({tokenBalances, tokenValues, type}) => {

	return (
		<>
			{tokenBalances.length > 0 && <div className='px-16 py-5 pb border-t border-web-gray'>
				<h2 className='font-bold uppercase text-gray-300 text-xl'>{type}</h2>
				<TokenBalances
					tokenBalances={tokenBalances}
					tokenValues={tokenValues} />
			</div>}

		</>);

};

export default Balances;