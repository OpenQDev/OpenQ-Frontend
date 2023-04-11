/**
 * @vi-environment jsdom
 */
import React from 'react';
import { cleanup } from '../../../../test-utils';
import { render, screen } from '../../../../test-utils';
import MiniDepositList from '../../../../components/User/OverviewTab/DepositList';
import Constants from '../../../../test-utils/constant';

describe('MiniDepositList', () => {
  const deposits = [Constants.deposits[0]];

  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
    afterEach(() => {
      cleanup();
    });
  });

  it('should render Bounty heading', async () => {
    // ARRANGE
    render(<MiniDepositList deposits={deposits} />);

    // ASSERT
    expect(screen.getByText(/Deposited on: August 29, 2022 at 15:12/)).toBeInTheDocument();
  });
  it('should render Bounty heading', async () => {
    // ARRANGE
    render(<MiniDepositList deposits={deposits} />);

    // ASSERT
    expect(screen.getByText(/Deposited on: August 29, 2022 at 15:12/)).toBeInTheDocument();
  });
});
