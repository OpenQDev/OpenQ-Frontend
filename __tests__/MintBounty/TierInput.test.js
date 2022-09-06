/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import TierInput from '../../components/MintBounty/TierInput';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

const mockTierVolumeChange = jest.fn();
describe('MintBountyButton', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<TierInput tier={2} tierVolume={80} onTierVolumeChange={mockTierVolumeChange} />);

    // ACT
    const tierInput = screen.getByRole('textbox');
    await user.type(tierInput, 'hi');
    expect(mockTierVolumeChange).toHaveBeenCalledTimes(2);
  });
});
