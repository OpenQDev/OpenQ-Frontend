/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import MintBountyModalButton from '../../components/MintBounty/MintBountyModalButton';

const zeroAddressMetadata = {
  name: 'Zero Address',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ZERO',
  decimals: 18,
  chainId: 80001,
  path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
};
const issues = [
  {
    status: 'mintable',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
  },
  {
    status: 'minted',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221',
  },
  {
    status: 'unknown',
    url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/2190',
  },
];

const test = (issue) => {
  it('should be disabled when on correct network but not mintable yet.', () => {
    // ARRANGE
    render(
      <MintBountyModalButton
        enableMint={false}
        isLoadingState={[false]}
        issue={{ url: 'issues' }}
        currentSum={100}
        account={true}
        finalTierVolumesState={[[10, 20, 70]]}
        isOnCorrectNetwork={true}
        payoutTokenState={[zeroAddressMetadata]}
        payoutVolumeState={['']}
        enableRegistrationState={[false]}
        registrationDeadlineState={[new Date()]}
        startDateState={[new Date()]}
        isLoadngState={[false]}
        setError={jest.fn()}
        goalVolumeState={['']}
        goalTokenState={[zeroAddressMetadata]}
      />
    );

    expect(screen.getByRole('button', { name: 'Deploy Contract' }).disabled).toBe(true);
  });
  it('should disappear when enabled transaction pending.', async () => {
    // ARRANGE
    render(
      <MintBountyModalButton
        enableMint={true}
        isLoadingState={[false]}
        issue={{ url: 'issues' }}
        currentSum={100}
        account={true}
        finalTierVolumesState={[[10, 20, 70]]}
        isOnCorrectNetwork={true}
        payoutTokenState={[zeroAddressMetadata]}
        payoutVolumeState={['']}
        registrationDeadlineState={[new Date()]}
        enableRegistrationState={[false]}
        startDateState={[new Date()]}
        isLoadngState={[true]}
        goalTokenState={[zeroAddressMetadata]}
        setError={jest.fn()}
        goalVolumeState={['']}
      />
    );
    const button = screen.queryByRole('button', { name: 'Deploy Contract' });
    expect(button).not.toBeInTheDocument();
  });
  it('should work when enabled.', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <MintBountyModalButton
        account={true}
        enableMint={true}
        isLoadingState={[false]}
        issue={issue}
        currentSum={100}
        finalTierVolumesState={[[10, 20, 70]]}
        isOnCorrectNetwork={true}
        payoutTokenState={[zeroAddressMetadata]}
        payoutVolumeState={['']}
        setError={jest.fn()}
        enableRegistrationState={[false]}
        registrationDeadlineState={[new Date()]}
        startDateState={[new Date()]}
        isLoadngState={[false]}
        goalVolumeState={['']}
        goalTokenState={[zeroAddressMetadata]}
      />
    );

    await user.click(screen.getByRole('button'));
  });
};

describe('MintBountyModalButton', () => {
  issues.forEach((issue) => {
    test(issue);
  });
});
