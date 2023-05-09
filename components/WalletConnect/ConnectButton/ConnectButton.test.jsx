/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import ConnectButton from '.';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

describe('ConnectButton', () => {
  // Test cases for

  const push = vi.fn(() => {
    return { catch: vi.fn };
  });
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));

    nextRouter.useRouter = vi.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: vi.fn(() => {
        return { catch: vi.fn };
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
