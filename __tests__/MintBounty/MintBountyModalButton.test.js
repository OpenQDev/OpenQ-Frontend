/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MintBountyModalButton from '../../components/MintBounty/MintBountyModal/MintBountyModalButton';
import MintContext from '../../components/MintBounty/MintContext';
import InitialMintState from '../../components/MintBounty/InitialMintState';

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
    const mintState = {
      ...InitialMintState,
      enableMint: false,
      isLoading: false,
      finalTierVolumes: [10, 20, 70],
      issue: { url: 'asdf' },
      goalToken: zeroAddressMetadata,
      goalVolume: '',
      registrationDeadline: new Date(),
      startDate: new Date(),
      enableRegistration: true,
      category: 'Contest',
      payoutVolume: 100,
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = jest.fn();

    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <MintBountyModalButton currentSum={100} setError={jest.fn()} />
      </MintContext.Provider>
    );

    expect(screen.getAllByRole('button', { name: 'Deploy Contract' })[0].disabled).toBe(true);
  });

  const mintState = {
    ...InitialMintState,
    enableMint: false,
    isLoading: false,
    finalTierVolumes: [10, 20, 70],
    issue: issue,
    goalToken: zeroAddressMetadata,
    goalVolume: '',
    registrationDeadline: new Date(),
    startDate: new Date(),
    enableRegistration: true,
    category: 'Contest',
    payoutVolume: 100,
    payoutToken: zeroAddressMetadata,
  };
  const mintDispatch = jest.fn();

  render(
    <MintContext.Provider value={[mintState, mintDispatch]}>
      <MintBountyModalButton currentSum={100} setError={jest.fn()} />
    </MintContext.Provider>
  );
};

describe('MintBountyModalButton', () => {
  issues.forEach((issue) => {
    test(issue);
  });
});
