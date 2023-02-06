// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import WatchButton from '../../components/WatchButton/WatchButton';
import Constants from '../../test-utils/constant';
import { waitFor } from '@testing-library/react';
// Test cases for full balances, empty balances, and undefined balances.
const bounty = Constants;
describe('sample', () => {
  // Test cases for
  it('sample', async () => {
    // ARRANGE
    const user = userEvent.setup();
    await waitFor(async () => {
      render(<WatchButton bounty={bounty} watchingState={false} />);

      // ASSERT
      const watchButton = await screen.findByRole('button');
      expect(watchButton).toBeInTheDocument();
      await user.click(watchButton);
    });
  });
});
