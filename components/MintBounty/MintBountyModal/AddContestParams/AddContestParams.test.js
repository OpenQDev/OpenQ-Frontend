/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import AddContestParams from '.';
import InitialMintState from '../../../../components/MintBounty/InitialMintState';
import MintContext from '../../../../components/MintBounty/MintContext';
//const mockTierVolumeChange = jest.fn();
describe('AddContestParams', () => {
  const zeroAddressMetadata = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  };

  it('should display Fixed Contest', async () => {
    // ARRANGE
    const currentDate = new Date();
    const mintState = {
      ...InitialMintState.mintState,
      startDate: currentDate,
      type: 3,
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

    expect(screen.getByText(/Fixed contests can only be funded with one token./i)).toBeInTheDocument();
    expect(screen.getByText(/1st/i)).toBeInTheDocument();
    expect(screen.getByText(/2nd/i)).toBeInTheDocument();
    expect(screen.getByText(/3rd/i)).toBeInTheDocument();
    // ASSERT

    expect(mintDispatch).toHaveBeenCalledTimes(2);
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
