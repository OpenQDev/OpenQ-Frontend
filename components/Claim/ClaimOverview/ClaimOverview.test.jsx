/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import ClaimOverview from '.';
import nextRouter from 'next/router';
import Constants from '../../../test-utils/constant';

nextRouter.useRouter = vi.fn();
const push = vi.fn(() => {
  return { catch: vi.fn };
});

const bounty = Constants.bountyClaimOverview;

describe('ClaimOverview', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: vi.fn(() => {
        return { catch: vi.fn };
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
    //leave this in here otherwise vi will exit and errors will show up in the test console
    const claimant1 = await screen.findAllByText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
    expect(claimant1[0]).toBeInTheDocument();
    // should have 6 instances of $8.04 in the document
    /* expect(screen.getAllByText(/^\$8.04/)[5]).toBeInTheDocument();

    // should have 2 instances of $16.08 in the document
    expect(screen.getAllByText(/^\$16.08/)[1]).toBeInTheDocument();

    // should have 8 instances of 100% in the document
    expect(screen.getAllByText(/^100.+%$/)[8]).toBeInTheDocument(); */

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
