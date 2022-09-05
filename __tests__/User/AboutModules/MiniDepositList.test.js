/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import MiniDepositList from '../../../components/User/AboutModules/DepositList';

describe('MiniDepositList', () => {
  const deposits = [
    {
      __typename: 'Deposit',
      id: '0xdd9e09885524a2f2c9a906d7c19c9243d8176d355e5e2bf4d87e8cdd2f85dc89',
      refunded: false,
      refundTime: null,
      expiration: '2592000',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      volume: '12000000000000000000',
      sender: {
        __typename: 'User',
        id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      receiveTime: '1654260907',
    },
    {
      __typename: 'Deposit',
      id: '0xdf51f125ba48ca6ffba4cbbe797e434b792cc6f47c900108a82cd97736619126',
      refunded: false,
      refundTime: null,
      expiration: '2592000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '12000000000000000000',
      sender: {
        __typename: 'User',
        id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      },
      receiveTime: '1654260893',
    },
  ];

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  it('should render Bounty heading', async () => {
    // ARRANGE
    render(<MiniDepositList deposits={deposits} />);

    // ASSERT
    expect(screen.getByText(/Deposited on: June 3, 2022 at 8:54/)).toBeInTheDocument();
  });
  it('should render Bounty heading', async () => {
    // ARRANGE
    render(<MiniDepositList deposits={deposits} />);

    // ASSERT
    expect(screen.getByText(/Refundable on: July 3, 2022 at 8:55/)).toBeInTheDocument();
  });
});
