/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import LoadingBar from '.';
import InitialState from '../../../store/Store/InitialState';
import userEvent from '@testing-library/user-event';

describe('LoadingBar', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });

  it('should loading text and allow user to close it.', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<LoadingBar />, {}, { bountyMinted: true });
    // ACT
    const text = await screen.findByText(
      'It will take a couple of minutes until your contract will be visible in our explorer'
    );
    // ASSERT
    expect(text).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(text).not.toBeInTheDocument();
  });
});
