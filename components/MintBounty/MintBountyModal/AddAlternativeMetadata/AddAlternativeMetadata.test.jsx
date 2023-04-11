// test/component/WatchButton/WatchButton.test.js
/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import AddAlternativeMetadata from '.';
import MintContext from '../../MintContext';
// Test cases for full balances, empty balances, and undefined balances.
describe('Add AlternativeMetadata', () => {
  const organizationData = {
    payload: { avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4', name: 'OpenQ Labs' },
    type: 'SET_ALT_URL',
  };
  // Test cases for
  it('should allow user to update org', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mintState = {};
    const mintDispatch = vi.fn();
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <AddAlternativeMetadata />
      </MintContext.Provider>
    );

    // ASSERT
    const urlInput = await screen.findByRole('textbox');
    expect(urlInput).toBeInTheDocument();
    await user.type(urlInput, 'https://github.com/OpenQDev');
    expect(mintDispatch).toHaveBeenCalledWith(organizationData);

    expect(urlInput).toBeInTheDocument();
  });
  it('should display org', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mintState = { altUrl: 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4', altName: 'agasdf' };
    const mintDispatch = vi.fn();
    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <AddAlternativeMetadata />
      </MintContext.Provider>
    );

    // ASSERT
    const urlInput = await screen.findByRole('textbox');
    expect(urlInput).toBeInTheDocument();
    await user.type(urlInput, 'https://github.com/OpenQDev');
    expect(mintDispatch).toHaveBeenCalledWith(organizationData);

    expect(urlInput).toBeInTheDocument();
  });
});
