/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import SetBudgetAdminPage from '.';
import InitialState from '../../../store/Store/InitialState';
import Constants from '../../../test-utils/constant';
import userEvent from '@testing-library/user-event';
import MockOpenQClient from '../../../services/ethers/MockOpenQClient';
describe('SetBudgetAdminPage', () => {
  const bounty = Constants.bounty;
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
    const setFundingGoal = jest.fn();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ setFundingGoal }),
    };
    render(<SetBudgetAdminPage refreshBounty={() => {}} bounty={bounty} />, {}, customInitialState);
    expect(screen.getByText('Set a New Budget for this Contract')).toBeInTheDocument();

    // ACT
    await user.type(screen.getByRole('textbox'), '100');
    await user.click(screen.getByRole('button', { name: 'select token' }));
    await user.click(screen.getByRole('button', { name: /link/i }));
    await user.click(await screen.findByRole('button', { name: 'Set New Budget' }));

    // ASSERT
    expect(await screen.findByText(/Updating Budget.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    const updatedTexts = await screen.findAllByText(/updated/i);
    expect(updatedTexts[0]).toBeInTheDocument();
    expect(await screen.findByText(/budget set to/i)).toBeInTheDocument();
    expect(await screen.findByText(/100.0 LINK/)).toBeInTheDocument();
    expect(setFundingGoal).toBeCalledWith(bounty.bountyId, '100', '0x5FbDB2315678afecb367f032d93F642f64180aa3');
  });
});
