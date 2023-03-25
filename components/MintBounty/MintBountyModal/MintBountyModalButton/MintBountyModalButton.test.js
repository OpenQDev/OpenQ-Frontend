/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../test-utils';
import MintBountyModalButton from '.';
import MintContext from '../../MintContext';
import InitialMintState from '../../InitialMintState';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

const zeroAddressMetadata = {
  name: 'Zero Address',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ZERO',
  decimals: 18,
  chainId: 80001,
  path: '/crypto-logos/MATIC.svg',
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

it('should be disabled when on correct network, mintable, but start date > end date', () => {
  const mintState = {
    ...InitialMintState,
    enableMint: true,
    isLoading: false,
    finalTierVolumes: [10, 20, 70],
    issue: issues[0],
    goalToken: zeroAddressMetadata,
    goalVolume: '',
    registrationDeadline: new Date('01-01-2023'),
    startDate: new Date('12-12-2023'),
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
  const tooltip = screen.getAllByText(
    /Please make sure your Hackathon Start Date is > today and your End Date after your Start Date./i
  );
  expect(tooltip[0]).toBeInTheDocument();
});

it('should show "choose eligible issue" when on correct network, minted, and start date > end date', () => {
  const mintState = {
    ...InitialMintState,
    enableMint: false,
    isLoading: false,
    finalTierVolumes: [10, 20, 70],
    issue: issues[1],
    goalToken: zeroAddressMetadata,
    goalVolume: '',
    registrationDeadline: new Date('01-01-2023'),
    startDate: new Date('12-12-2023'),
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
  const tooltip = screen.getAllByText(/Please choose an eligible issue./i);
  expect(tooltip[0]).toBeInTheDocument();
});

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
