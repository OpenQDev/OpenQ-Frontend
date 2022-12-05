/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../../test-utils';
import TierResult from '../../../../../components/MintBounty/MintBountyModal/AddContestParams/SetTierValues/TierResult';
import InitialState from '../../../../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

const mockTierVolumeChange = jest.fn();
describe('Tier Tier Result', () => {
  it('should show tier selecter', async () => {
    // ARRANGE
    render(<TierResult tier={2} finalTierVolumes={[20, 80]} onTierVolumeChange={mockTierVolumeChange} />);

    // ACT
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });
});
