// test/pages/index.test.js
/**
 * @vi-environment jsdom
 */

/*

                  lean={true}
                  tokenBalances={payoutBalances}
                  tokenValues={payoutValues}
                  singleCurrency={true}
                  small={true}
                   tokenBalances={[deposit]} tokenValues={tokenValues} lean={true} singleCurrency={true}
                   
          <TokenBalances tokenBalances={tokenBalances} tokenValues={tokenValues} />
          <TokenBalances lean={true} tokenBalances={deposit} tokenValues={tokenValues} singleCurrency={true} />
*/
import React from 'react';
import { render, screen } from '../../test-utils';
import TokenBalances from '../../components/TokenBalances/TokenBalances';
// Test cases for full balances, empty balances, and undefined balances.

const tokenBalances = [
  {
    __typename: 'BountyFundedTokenBalance',
    volume: '12000000000000000000',
    tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  },
];

// Test cases for
const test = (tokenBalances) => {
  it('should render balances', async () => {
    // ARRANGE
    render(<TokenBalances tokenBalances={tokenBalances} />);

    // ASSERT
    expect(await screen.findByText(/12.0/)).toBeInTheDocument();
    expect(await screen.findByText(/8.04/)).toBeInTheDocument();
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
};

describe('TokenBalances', () => {
  test(tokenBalances);
});
