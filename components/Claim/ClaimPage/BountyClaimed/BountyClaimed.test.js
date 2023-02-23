/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import BountyClaimed from '.';
import nextRouter from 'next/router';
import Constants from '../../../../test-utils/constant';
nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

describe('BountyClaimed', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });
  it('should render bounty claimed', async () => {
    // ARRANGE
    const currentUser = 'U_kgDOBZIDuA';
    const bounty = {
      ...Constants.bounty3,
      tierWinners: [currentUser],
      claims: [{ tier: '0', claimantAsset: 'claimantAsset' }],
    };
    render(<BountyClaimed bounty={bounty} />, {}, { accountData: { github: currentUser } });

    // ACT
    expect(screen.getByText(/update readme/i)).toBeInTheDocument();
    expect(screen.getByText(/1st place/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Congratulations on winning this bounty! Your share of the funds deposited on this bounty have been sent to your wallet./i
      )
    ).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
