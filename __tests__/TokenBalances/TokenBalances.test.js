// test/pages/index.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import TokenBalances from '../../components/TokenBalances/TokenBalances';
// Test cases for full balances, empty balances, and undefined balances.
const tokenValues = {
  tokenPrices: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 0.67 },
  tokens: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 8.040000000000001 },
  total: 8.04,
};
const tokenBalances = [
  {
    __typename: 'BountyFundedTokenBalance',
    volume: '12000000000000000000',
    tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  },
];

// Test cases for
const test = (tokenBalances, tokenValues) => {
  it('should render balances', async () => {
    // ARRANGE
    render(<TokenBalances tokenBalances={tokenBalances} singleCurrency={true} tokenValues={tokenValues} />);

    // ASSERT
    expect(await screen.findByText(/12.0/)).toBeInTheDocument();
    expect(await screen.findByText(/8.04/)).toBeInTheDocument();
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
};

describe('TokenBalances', () => {
  test(tokenBalances, tokenValues);
});
