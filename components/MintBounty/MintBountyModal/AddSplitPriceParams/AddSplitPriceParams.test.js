// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import AddSplitPriceParams from '.';
import { waitFor } from '@testing-library/react';
import MintContext from '../../MintContext';
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
      type: 'UPDATE_PAYOUT_TOKEN',
    };
    const updateVolumePayload = { payload: '2', type: 'UPDATE_PAYOUT_VOLUME' };
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <AddSplitPriceParams />
      </MintContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/reward split/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'select token' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    user.click(screen.getByText(/weth/i));
    await user.type(screen.getAllByRole('textbox')[0], '20');
    expect(mintDispatch).toHaveBeenCalledWith(updateToEthPayload);
    expect(mintDispatch).toHaveBeenCalledWith(updateVolumePayload);
  });
});
