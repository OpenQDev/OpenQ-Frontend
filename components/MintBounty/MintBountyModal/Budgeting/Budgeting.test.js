// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import MintContext from '../../MintContext';
import Budgeting from '.';
// Test cases for full balances, empty balances, and undefined balances.
describe('sample', () => {
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });
  // Test cases for
  it('allow user to search for other split price types', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mintState = { altUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4', altName: 'agasdf' };
    const mintDispatch = jest.fn();
    const updateToEthPayload = {
      payload: {
        address: '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323',
        chainId: 80001,
        decimals: 18,
        name: 'Wrapped Ether',
        path: 'https://wallet-asset.matic.network/img/tokens/eth.svg',
        symbol: 'WETH',
      },
      type: 'UPDATE_GOAL_TOKEN',
    };

    const updateVolumePayload = { payload: '2', type: 'UPDATE_GOAL_VOLUME' };
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <Budgeting />
      </MintContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/Set a Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/How much will each successful submitter earn?/i)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox'));

    const button = screen.getByRole('button', { name: 'select token' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    await user.click(screen.getByText(/weth/i));
    await user.type(screen.getAllByRole('textbox')[0], '20');
    expect(mintDispatch).toHaveBeenCalledWith(updateToEthPayload);
    expect(mintDispatch).toHaveBeenCalledWith(updateVolumePayload);
  });
});
