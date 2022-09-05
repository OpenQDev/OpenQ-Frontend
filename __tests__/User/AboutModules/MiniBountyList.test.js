/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import MiniBountyList from '../../../components/User/AboutModules/MiniBountyList';

describe('MiniBountyList', () => {
  const payouts = [
    {
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

  it('should render MiniBountyList with link', async () => {
    // ARRANGE
    render(<MiniBountyList payouts={payouts} title={'example'} />);

    // ASSERT
    expect(await screen.findByText(/0.40/)).toBeInTheDocument();
    expect(await screen.findByText(/0.60/)).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
