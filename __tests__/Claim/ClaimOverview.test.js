/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ClaimOverview from '../../components/Claim/ClaimOverview';
import nextRouter from 'next/router';
import Constants from '../../test-utils/constant';

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

describe('ClaimOverview', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should render the headings', async () => {
    // ARRANGE
    render(<ClaimOverview bounty={bounty} />);

    // ASSERT
    // column headings

    const link = screen.getByText('LINK');
    expect(link).toBeInTheDocument();
    const derc = screen.getByText('DERC20');
    expect(derc).toBeInTheDocument();
    const matic = screen.getByText('MATIC');
    expect(matic).toBeInTheDocument();
    const total = screen.getByText('TOTAL');
    expect(total).toBeInTheDocument();

    // row descriptions
    const subTotal = await screen.findByText('SubTotal');
    expect(subTotal).toBeInTheDocument();
    const stillClaimable = await screen.findByText('Still Claimable');
    expect(stillClaimable).toBeInTheDocument();
    const refundable = await screen.findByText('of which currently');
    expect(refundable).toBeInTheDocument();
    const refunded = await screen.findByText('Refunded');
    expect(refunded).toBeInTheDocument();
    const totalDeposited = await screen.findByText('Total Deposited');
    expect(totalDeposited).toBeInTheDocument();
    //leave this in here otherwise jest will exit and errors will show up in the test console
    const claimant1 = await screen.findAllByText('sample.eth');
    expect(claimant1[0]).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
