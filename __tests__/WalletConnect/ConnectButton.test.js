/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ConnectButton from '../../components/WalletConnect/ConnectButton';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

describe('ConnectButton', () => {
  // Test cases for

  const push = jest.fn(() => {
    return { catch: jest.fn };
  });
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));

    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should open modal and display link to profile.', async () => {
    // ARRANGE
    render(<ConnectButton nav={true} />);

    // ASSERT
    const accountBtn = screen.getAllByRole('button');
    expect(accountBtn[0]).toBeInTheDocument();
  });
});
