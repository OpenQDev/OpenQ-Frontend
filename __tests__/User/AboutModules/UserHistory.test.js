/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import UserHistory from '../../../components/User/AboutModules/UserHistory';

describe('UserHistory', () => {
  const payouts = [
    {
      organization: { id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4' },
      bounty: {
        bountyId: 'I_kwDOGWnnz85I9Agl',
        issuer: {
          id: '0x46e09468616365256f11f4544e65ce0c70ee624b',
        },
      },
      volume: '600000000000000000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      organization: { id: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4' },
      bounty: {
        bountyId: 'I_kwDOGWnnz85I9Agl',
        issuer: {
          id: '0x46e09468616365256f11f4544e65ce0c70ee624b',
        },
      },
      volume: '900000000000000000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
  ];
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    process.env.NEXT_PUBLIC_COIN_API_URL = 'http://localhost:3030';
    process.env.COIN_API_SSR_URL = 'http://localhost:3030';

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render UserHistory with link', async () => {
    // ARRANGE
    render(<UserHistory payouts={payouts} title={'example'} />);

    // ASSERT
    expect(await screen.findByText(/Bounties Collected/)).toBeInTheDocument();
    expect(await screen.findByText(/2/)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
