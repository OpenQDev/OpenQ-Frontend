/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../../test-utils';
import SetPayoutToken from '.';
import InitialMintState from '../../..//InitialMintState';
import MintContext from '../../../MintContext';
import { waitFor } from '@testing-library/react';

//const mockTierVolumeChange = jest.fn();
describe('Tier Input', () => {
  it('should show tier selecter', async () => {
    // ARRANGE

    const zeroAddressMetadata = {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    };
    const mintState = {
      ...InitialMintState.mintState,
      payoutToken: zeroAddressMetadata,
      category: 'Fixed Contest',
      hideModal: false,
    };
    const mintDispatch = jest.fn();

    const content = {
      body: 'This is a test',
      message: 'This is a test msg',
    };
    await waitFor(async () => {
      render(
        <MintContext.Provider value={[mintState, mintDispatch]}>
          <SetPayoutToken content={content} />
        </MintContext.Provider>
      );

      // ACT
      expect(screen.getByText(/Matic/i)).toBeInTheDocument();
    });
    // expect startdate to be in input
  });
});
