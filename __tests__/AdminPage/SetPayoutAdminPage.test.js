/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import SetPayoutAdminPage from '../../components/AdminPage/SetPayoutAdminPage';
import InitialState from '../../store/Store/InitialState';
import Constants from '../../test-utils/constant';
import userEvent from '@testing-library/user-event';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';
describe('SetPayoutAdminPage', () => {
  const bounty = Constants.bounty1;
  beforeEach(() => {
    InitialState.openQClient.reset();
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });
  it('should allow user to update budget', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const setPayout = jest.fn();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ setPayout }),
    };
    render(<SetPayoutAdminPage refreshBounty={() => {}} bounty={bounty} />, {}, customInitialState);
    expect(screen.getByText('Set Payout for Each Submitter')).toBeInTheDocument();

    // ACT
    await user.type(screen.getByRole('textbox'), '100');
    await user.click(screen.getByRole('button', { name: 'select token' }));
    await user.click(screen.getByRole('button', { name: /link/i }));
    await user.click(await screen.findByRole('button', { name: 'Set Payout' }));

    // ASSERT
    expect(await screen.findByText(/Updating Payout.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    expect(await screen.findByText(/updated/i)).toBeInTheDocument();
    expect(await screen.findByText(/payout set to/i)).toBeInTheDocument();
    expect(await screen.findByText(/100.0 LINK/i)).toBeInTheDocument();
    expect(setPayout).toBeCalledWith(bounty.bountyId, '100', '0x5FbDB2315678afecb367f032d93F642f64180aa3');
  });
});
