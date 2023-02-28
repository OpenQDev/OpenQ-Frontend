/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminPage from '.';
import InitialState from '../../store/Store/InitialState';
import { waitFor } from '@testing-library/react';
import Constants from '../../test-utils/constant';

describe('AdminPage', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should show BountyClosed info when closed', async () => {
    const bounty = { ...Constants.bounty, status: '1' };
    // ARRANGE
    render(<AdminPage bounty={bounty} />);
    // ACT
    await waitFor(() => {
      const heading = screen.getByText('This contract is closed.');
      const subheading = screen.getByText('You cannot initiate actions on a closed contract.');
      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
    });
  });

  it('should show set budget on all open bounties', async () => {
    const bounty = { ...Constants.bounty, status: '0' };
    // ARRANGE
    render(<AdminPage bounty={bounty} />);
    // ACT
    await waitFor(() => {
      const heading = screen.getByText('Settings');
      const subheading = screen.getByText('Modifications');
      const budgetText = screen.getByText('Set a New Budget for this Contract');
      const budgetBtn = screen.getByRole('button', { name: 'Set New Budget' });
      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(budgetText).toBeInTheDocument();
      expect(budgetBtn).toBeInTheDocument();
    });
  });


  it('should render contest contract settings', async () => {
    const bounty = { ...Constants.bounty2, status: '0', bountyType: '2' };
    // ARRANGE
    render(<AdminPage bounty={bounty} />);
    // ACT
    await waitFor(() => {
      const subheading = screen.getByText('How many Tiers?');
      const tierHeading = screen.getByText('Weight per Tier (%)');
      const inputFieldBudget = screen.getByPlaceholderText('0.0');
      const inputFieldTiers = screen.getByDisplayValue('3');
      const selectCurrency = screen.getByText(/Matic/i);
      const payoutBtn = screen.getByRole('button', { name: 'Set New Payout Schedule' });
      // ASSERT
      expect(subheading).toBeInTheDocument();
      expect(tierHeading).toBeInTheDocument();
      expect(inputFieldBudget).toBeInTheDocument();
      expect(inputFieldTiers).toBeInTheDocument();
      expect(selectCurrency).toBeInTheDocument();
      expect(payoutBtn).toBeInTheDocument();
    });
  });
});
