/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../../test-utils';
import MintBountyInputIssue from '.';
import userEvent from '@testing-library/user-event';
import MintContext from '../../../MintContext';
import InitialMintState from '../../../InitialMintState';

describe('MintBountyInput', () => {
  it('should display atomic header', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const zeroAddressMetadata = {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    };
    const mintState = {
      ...InitialMintState,
      enableMint: false,
      isLoading: false,
      finalTierVolumes: [10, 20, 70],
      goalToken: zeroAddressMetadata,
      goalVolume: '',
      registrationDeadline: new Date(),
      startDate: new Date(),
      enableRegistration: true,
      category: 'Contest',
      payoutVolume: 100,
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = vi.fn();

    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <MintBountyInputIssue />
      </MintContext.Provider>
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'https://github.com/svelte/issue/3');
    expect(screen.getByText(/Enter github issue/i)).toBeInTheDocument();
    expect(mintDispatch).toHaveBeenCalledTimes(33);
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
