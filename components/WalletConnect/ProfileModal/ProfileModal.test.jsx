// test/component/WatchButton/WatchButton.test.js
/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import ProfileModal from '.';
import nextRouter from 'next/router';
import Constants from '../../../test-utils/constant';
// Test cases for full balances, empty balances, and undefined balances.

describe('AccountModal', () => {
  // Test cases for

  const setIsConnecting = vi.fn();
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
    const initialState = { accountData: Constants.accountData };
    // ARRANGE
    render(<ProfileModal showModal={true} setIsConnecting={setIsConnecting} />, {}, initialState);
    expect(screen.getByText(/Signed in/)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(Constants.userName)).toBeInTheDocument();

    // ASSERT
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
