/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MiniDepositCard from '../../components/Bounty/MiniDepositCard';

describe('MiniDepositCard', () => {
  it('should render MiniDepositCard', async () => {
    const deposit = {
      __typename: 'Deposit',
      id: '0xd024e550ba670d71f23f336c63ed0aacda946c6836f416028ffa0888b1a4b691',
      refunded: false,
      refundTime: null,
      expiration: '2592000',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      bounty: {
        bountyId: 'I_kwDOGWnnz85I9Ahl',
      },
      volume: '12000000000000000000',
      sender: {
        __typename: 'User',
        id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      receiveTime: '1642021044',
    };
    // ARRANGE
    render(<MiniDepositCard deposit={deposit} showLink={true} />);

    // ASSERT

    expect(await screen.findByText(/12.00 LINK/i)).toBeInTheDocument();
    expect(await screen.findByText(/Good first issue/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
