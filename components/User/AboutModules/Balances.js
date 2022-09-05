// Third Party
import React from 'react';

// Custom
import TokenBalances from '../../TokenBalances/TokenBalances';

const Balances = ({ tokenBalances, tokenValues, type }) => {
  return (
    <>
      {tokenBalances.length > 0 && (
        <div className='px-8 py-6 pb border-t border-web-gray'>
          <h2 className='font-semibold text-lg'>{type}</h2>
          <TokenBalances tokenBalances={tokenBalances} tokenValues={tokenValues} />
        </div>
      )}
    </>
  );
};

export default Balances;
