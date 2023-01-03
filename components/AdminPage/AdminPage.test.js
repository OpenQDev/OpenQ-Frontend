/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminPage from '.';
import InitialState from '../../store/Store/InitialState';
import { waitFor } from '@testing-library/react';
import Constants from '../../test-utils/constant';

const bounties = Constants.bounties;

describe('AdminPage', () => {
  beforeEach(() => {
    InitialState.openQClient.reset();
  });

  const test = (bounty) => {
    it('should show BountyClosed info when closed', async () => {
      if (bounty.status == 1) {
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
      }
    });

    it('should show set budget on all open bounties', async () => {
      if (bounty.status == 0) {
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
      }
    });

    it('should render split price contract settings', async () => {
      if (bounty.status == 0 && bounty.bountyType == 1) {
        // ARRANGE
        render(<AdminPage bounty={bounty} />);
        // ACT
        await waitFor(() => {
          const heading = screen.getAllByText('Close Split Price Contract');
          const subheading = screen.getByText(
            'Once you close this split price contract, there is no going back. Please be certain.'
          );
          const payoutText = screen.getByText('Set Payout for Each Submitter');
          const inputField = screen.getAllByPlaceholderText('0.0');
          const selectCurrency = screen.getAllByText(/Matic/i);
          const payoutBtn = screen.getByRole('button', { name: 'Set Payout' });
          const closeBtn = screen.getByRole('button', { name: 'Close Split Price Contract' });
          // ASSERT
          expect(heading).toHaveLength(2);
          expect(subheading).toBeInTheDocument();
          expect(payoutText).toBeInTheDocument();
          expect(inputField).toHaveLength(2);
          expect(selectCurrency).toHaveLength(2);
          expect(payoutBtn).toBeInTheDocument();
          expect(closeBtn).toBeInTheDocument();
        });
      }
    });

    it('should render contest contract settings', async () => {
      if (bounty.status == 0 && bounty.bountyType == 2) {
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
      }
    });
  };

  bounties.forEach((bounty) => test(bounty));
});
