/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import TextTierInput from '../../components/MintBounty/TextTierInput';
import InitialState from '../../store/Store/InitialState';

InitialState.openQClient.shouldSleep = 200;

const mockTierVolumeChange = jest.fn();
describe('Tier Input', () => {
  it('should show tier selecter', async () => {
    // ARRANGE
    render(<TextTierInput tier={2} tierVolumes={{ 2: 80 }} onTierVolumeChange={mockTierVolumeChange} />);

    // ACT
    expect(screen.getByPlaceholderText(/2nd winner/).value).toEqual('80');
  });
});
