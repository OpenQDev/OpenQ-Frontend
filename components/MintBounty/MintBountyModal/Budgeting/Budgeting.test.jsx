// test/component/WatchButton/WatchButton.test.js
/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import MintContext from '../../MintContext';
import Budgeting from '.';
// Test cases for full balances, empty balances, and undefined balances.
describe('sample', () => {
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });
  // Test cases for
  it('allow user to search for other split price types', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mintState = { altUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4', altName: 'agasdf' };
    const mintDispatch = vi.fn();
    const updateToUsdc = {
      payload: {
        name: 'Dummy ERC20',
        address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        symbol: 'DERC20',
        decimals: 18,
        chainId: 80001,
        path: '/crypto-logos/DAI.svg',
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
    await user.click(screen.getByText(/derc20/i));
    await user.type(screen.getAllByRole('textbox')[0], '20');
    expect(mintDispatch).toHaveBeenCalledWith(updateVolumePayload);
    expect(mintDispatch).toHaveBeenCalledWith(updateToUsdc);
  });
});
