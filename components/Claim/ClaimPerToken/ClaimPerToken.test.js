/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import ClaimPerToken from '.';
import nextRouter from 'next/router';
import Constants from '../../../test-utils/constant';

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

const bounty = {
  ...Constants.bounty,
  claims: [Constants.claim, Constants.claim],
  payouts: Constants.payouts,
  bountyTokenBalances: [Constants.bountyTokenBalanceDai],
};

describe('ClaimPerToken', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should display the right volume per claimant and token', async () => {
    // ARRANGE
    render(
      <ClaimPerToken
        bounty={bounty}
        tokenAddress={'0x0000000000000000000000000000000000000000'}
        claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'}
        type={'allClaimants'}
        changeObj={() => {}}
      />
    );

    // ASSERT
    const volDERC20 = await screen.findByText(/469.0/);
    expect(volDERC20).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display the right percentage per claimant and token', async () => {
    // ARRANGE
    render(
      <ClaimPerToken
        bounty={bounty}
        tokenAddress={'0x0000000000000000000000000000000000000000'}
        claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'}
        type={'perClaimant'}
        changeObj={() => {}}
      />
    );

    // ASSERT

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display the right value per claimant and token', async () => {
    // ARRANGE
    render(
      <ClaimPerToken
        bounty={bounty}
        tokenAddress={'0x0000000000000000000000000000000000000000'}
        claimant={'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'}
        type={'perClaimant'}
        changeObj={() => {}}
      />
    );

    // ASSERT

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  // Further test suites:
  // vol, percent and value for: subtotal, for still claimable, refundable, refunded, and total deposited
});
