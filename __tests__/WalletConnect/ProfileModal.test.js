// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ProfileModal from '../../components/WalletConnect/ProfileModal';
import nextRouter from 'next/router';
import Constants from '../../test-utils/constant';
// Test cases for full balances, empty balances, and undefined balances.

describe('AccountModal', () => {
  // Test cases for

  const setIsConnecting = jest.fn();
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
