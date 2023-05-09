// test/component/WatchButton/WatchButton.test
/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import AccountModal from '.';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

const setIsConnecting = vi.fn();

describe('AccountModal', () => {
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

  it('should render account modal', async () => {
    // ARRANGE
    render(<AccountModal showModal={true} setIsConnecting={setIsConnecting} />);
    expect(screen.getByText(/Localhost:8545/i)).toBeInTheDocument();
    expect(screen.getByText(/Disconnect/i)).toBeInTheDocument();
    expect(screen.getByText(/0xf39/i)).toBeInTheDocument();
    // ASSERT
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it(`shouldn render account modal when hidden`, async () => {
    // ARRANGE
    render(<AccountModal showModal={false} setIsConnecting={setIsConnecting} />);
    expect(screen.queryByText(/Disconnect/i)).not.toBeInTheDocument();
    // ASSERT
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
