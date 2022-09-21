/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import TierResults from '../../components/MintBounty/TierResult';
import InitialState from '../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

const mockTierVolumeChange = jest.fn();
describe('Tier Input', () => {
  it('should show tier selecter', async () => {
    // ARRANGE
    render(<TierResults tier={2} finalTierVolumes={[20, 80]} onTierVolumeChange={mockTierVolumeChange} />);

    // ACT
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });
});
