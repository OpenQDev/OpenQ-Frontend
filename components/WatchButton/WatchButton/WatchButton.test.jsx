// test/component/WatchButton/WatchButton.test.js
/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import WatchButton from '.';
import Constants from '../../../test-utils/constant';
// Test cases for full balances, empty balances, and undefined balances.
const bounty = Constants;
describe('WatchButton', () => {
  // Test cases for

  it('should render watch button', async () => {
    // ARRANGE
    render(<WatchButton bounty={bounty} watchingState={false} />);

    // ASSERT
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should allow user to manipulate watch button starting unwatched', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<WatchButton bounty={bounty} watchingState={false} />);

    // ASSERT
    const watchButton = await screen.findByRole('button');
    expect(watchButton).toBeInTheDocument();
    await user.click(watchButton);
    const watchingButton = await screen.findByText('Watching');
    await user.hover(watchingButton);
    const unwatchButton = await screen.findByText('Unwatch');
    expect(unwatchButton).toBeInTheDocument();
    expect(watchingButton).toHaveClass('group-hover:hidden');
  });
});
