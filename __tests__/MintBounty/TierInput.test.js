/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import TierInput from '../../components/MintBounty/TierInput';
import InitialState from '../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

const mockTierVolumeChange = jest.fn();
describe('MintBountyButton', () => {
  it('should open wizard and direct to discord server', async () => {
    // ARRANGE
    render(<TierInput tier={2} tierVolumes={{ 2: 80 }} onTierVolumeChange={mockTierVolumeChange} />);

    // ACT
    expect(screen.getByText(/2nd place/).toBeInTheDocument());
  });
});
