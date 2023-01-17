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
  describe('Split Price Contracts', () => {
    const splitBounty = Constants.bounty1;
    it('should allow user to update budget token and volume when no deposits', async () => {
      const noDepositSplitBounty = { ...splitBounty, deposits: [] };
      // ARRANGE
      const user = userEvent.setup();
      const setFundingGoal = jest.fn();
      const customInitialState = {
        ...InitialState,
        openQClient: new MockOpenQClient({ setFundingGoal }),
      };
      const { asFragment } = render(
        <SetBudgetAdminPage refreshBounty={() => {}} bounty={noDepositSplitBounty} />,
        {},
        customInitialState
      );
      expect(asFragment()).toMatchSnapshot('Snapshot: initial view');

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
      expect(setFundingGoal).toBeCalledWith(
        noDepositSplitBounty.bountyId,
        '100',
        '0x5FbDB2315678afecb367f032d93F642f64180aa3'
      );
    });
    it('should set payout token per default if payoutTokenVolume BUT allow user to update payout token and volume if no deposits', async () => {
      // payout token to DERC20, so showing that as default, but allowing change to Link since there are no deposits.
      // ARRANGE
      const noDepositButPayoutSplitBounty = {
        ...splitBounty,
        deposits: [],
        payoutTokenAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      };
      const user = userEvent.setup();
      const setFundingGoal = jest.fn();
      const customInitialState = {
        ...InitialState,
        openQClient: new MockOpenQClient({ setFundingGoal }),
      };
      const { asFragment } = render(
        <SetBudgetAdminPage refreshBounty={() => {}} bounty={noDepositButPayoutSplitBounty} />,
        {},
        customInitialState
      );
      expect(asFragment()).toMatchSnapshot('Snapshot: initial view');

      // ACT
      await user.type(screen.getByRole('textbox'), '100');
      const matic = screen.queryByText(/matic/i);
      expect(matic).not.toBeInTheDocument();
      const tokenButton = screen.getByRole('button', { name: 'select token' });
      await user.click(tokenButton);
      await user.click(screen.getByRole('button', { name: /link/i }));
      await user.click(await screen.findByRole('button', { name: 'Set New Budget' }));

      // ASSERT
      expect(await screen.findByText(/Updating Budget.../)).toBeInTheDocument();
      expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
      const updatedTexts = await screen.findAllByText(/updated/i);
      expect(updatedTexts[0]).toBeInTheDocument();
      expect(await screen.findByText(/100.0 LINK/i)).toBeInTheDocument();
      expect(setFundingGoal).toBeCalledWith(
        noDepositButPayoutSplitBounty.bountyId,
        '100',
        '0x5FbDB2315678afecb367f032d93F642f64180aa3'
      );
    });
    it('should lock token but allow volume update when deposits', async () => {
      // ARRANGE
      const otherTokenDepositSplitBounty = { ...splitBounty, deposits: [Constants.deposit2] };
      const user = userEvent.setup();
      const setFundingGoal = jest.fn();
      const customInitialState = {
        ...InitialState,
        openQClient: new MockOpenQClient({ setFundingGoal }),
      };
      render(
        <SetBudgetAdminPage refreshBounty={() => {}} bounty={otherTokenDepositSplitBounty} />,
        {},
        customInitialState
      );

      // ACT
      await user.type(screen.getByRole('textbox'), '100');
      const selectToken = screen.getByRole('button', { name: 'select token' });
      expect(selectToken).toBeDisabled(true);
      expect(selectToken).toMatchSnapshot('Snapshot: button style changes to not appear as button');
      await user.click(await screen.findByRole('button', { name: 'Set New Budget' }));

      // ASSERT
      expect(await screen.findByText(/Updating Budget.../)).toBeInTheDocument();
      expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
      const updatedTexts = await screen.findAllByText(/updated/i);
      expect(updatedTexts[0]).toBeInTheDocument();
      expect(await screen.findByText(/100.0 DERC20/i)).toBeInTheDocument();
      expect(setFundingGoal).toBeCalledWith(
        otherTokenDepositSplitBounty.bountyId,
        '100',
        otherTokenDepositSplitBounty.deposits[0].tokenAddress
      );
    });
  });
  describe('Fixed price contracts', () => {
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
});
