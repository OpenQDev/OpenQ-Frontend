/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import AddContestParams from '../../../../components/MintBounty/MintBountyModal/AddContestParams/AddContestParams';
import InitialMintState from '../../../../components/MintBounty/InitialMintState';
import MintContext from '../../../../components/MintBounty/MintContext';
import { waitFor } from '@testing-library/react';
//const mockTierVolumeChange = jest.fn();
describe('AddContestParams', () => {
  const zeroAddressMetadata = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  };

  it('should display Contest', async () => {
    // ARRANGE
    const currentDate = new Date();
    const mintState = {
      ...InitialMintState.mintState,
      startDate: currentDate,
      category: 'Contest',
      finalTierVolumes: [33, 34, 33],
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = jest.fn();

    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <AddContestParams />
      </MintContext.Provider>
    );

    // ACT

    expect(screen.getByText(/Weight per Tier/i)).toBeInTheDocument();
    expect(screen.getByText(/visual/i)).toBeInTheDocument();
    expect(screen.getByText(/text/i)).toBeInTheDocument();
    // ASSERT

    expect(mintDispatch).toHaveBeenCalledTimes(5);
    // expect startdate to be in input
  });

  /*
  it('should display Fixed Contest', async () => {
    // ARRANGE
    const mintState = {
      ...InitialMintState.mintState,
      category: 'Fixed Contest',
      finalTierVolumes: [20, 20, 20],
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = jest.fn();
    await waitFor(async () => {
      render(
        <MintContext.Provider value={[mintState, mintDispatch]}>
          <AddContestParams />
        </MintContext.Provider>
      );

      // ACT

      // ASSERT
      expect(mintDispatch).toHaveBeenCalledTimes(5);
      expect((await screen.findAllByRole('textbox'))[1]).toHaveValue('1');

      // expect startdate to be in input
    });
  });*/
});
