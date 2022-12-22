/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminModal from '../../components/Admin/AdminModal';
import InitialState from '../../store/Store/InitialState';
import { waitFor } from '@testing-library/react';
import Constants from '../../test-utils/constant';

describe('AdminModal', () => {
  const bounty = Constants.bounty;
  const modalBudget = Constants.modalBudget;

  const modalPayout = Constants.modalPayout;

  const modalCloseSplitPrice = Constants.modalClosedSplitPrice;

  const modalContest = Constants.modalClosedContest;

  beforeEach(() => {
    InitialState.openQClient.reset();
  });

  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const transaction = {
    transactionHash: '0xadfassadf',
    events: [{ args: [null, zeroAddress, '10000000000000000000'] }],
  };
  it('should display approve state', async () => {
    // ARRANGE
    render(
      <AdminModal
        bounty={{ bountyType: '1' }}
        payoutAddress={zeroAddress}
        setModal={() => null}
        modal={{
          title: 'Payout',
          type: 'Closed Split Price',
          transaction,
        }}
      />
    );
    await waitFor(() => {
      // ASSERT
      expect(screen.getByText(/Split Price Contract Closed!/i)).toBeInTheDocument();

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });

  it('should display approve state', async () => {
    // ARRANGE
    render(
      <AdminModal
        bounty={{ bountyType: '1' }}
        payoutAddress={zeroAddress}
        setModal={() => null}
        modal={{
          title: 'Payout',
          type: 'Budget',
          transaction,
        }}
      />
    );
    await waitFor(() => {
      // ASSERT
      expect(screen.getByText(/Budget updated/i)).toBeInTheDocument();
      expect(screen.getByText(/Budget set to:/i)).toBeInTheDocument();
      expect(screen.getByText(/0xa...adf/)).toBeInTheDocument();
      expect(screen.getByText('10.0 MATIC')).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });

  it('should display approve state', async () => {
    // ARRANGE
    render(
      <AdminModal
        bounty={{ bountyType: '1' }}
        payoutAddress={zeroAddress}
        setModal={() => null}
        modal={{
          title: 'Payout',
          type: 'Payout',
          transaction,
        }}
      />
    );
    await waitFor(() => {
      // ASSERT
      expect(screen.getByText(/Payout updated/i)).toBeInTheDocument();
      expect(screen.getByText(/Payout set to:/i)).toBeInTheDocument();
      expect(screen.getByText(/0xa...adf/)).toBeInTheDocument();
      expect(screen.getByText('10.0 MATIC')).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });

  it('should display approve state', async () => {
    // ARRANGE
    render(
      <AdminModal
        bounty={{ bountyType: '2' }}
        payoutAddress={zeroAddress}
        setModal={() => null}
        modal={{
          title: 'Payout',
          type: 'PayoutSchedule',
          transaction,
          finalTierVolume: ['1', '2', '3'],
        }}
      />
    );
    await waitFor(() => {
      // ASSERT
      expect(screen.getByText(/Payout Schedule Updated/i)).toBeInTheDocument();
      expect(screen.getByText(/Payout schedule set to/i)).toBeInTheDocument();
      expect(screen.getByText(/0xa...adf/)).toBeInTheDocument();
      expect(screen.getByText(/1st winner/)).toBeInTheDocument();
      expect(screen.getByText(/1 %/)).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });
  it('should display approve state', async () => {
    // ARRANGE
    render(
      <AdminModal
        bounty={{ bountyType: '3' }}
        payoutTokenAddress={zeroAddress}
        setModal={() => null}
        modal={{
          title: 'Payout',
          type: 'PayoutSchedule',
          transaction,
          finalTierVolume: ['1', '2', '3'],
        }}
      />
    );

    await waitFor(() => {
      // ASSERT
      expect(screen.getByText(/1 MATIC/)).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });
  const test = () => {
    it('should show Budget updated', async () => {
      // ARRANGE
      render(<AdminModal modal={modalBudget} bounty={bounty} />);
      await waitFor(() => {
        // ACT
        const heading = screen.getByText('Budget Updated!');
        const text = screen.getByText('Budget set to:');
        const amount = screen.getByText(/1.0 MATIC/i);
        const btn = screen.getByTestId('link', { name: 'Tweet about it' });

        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(amount).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      });
    });

    it('should show Set Payout Upated for split price contracts', async () => {
      // ARRANGE
      render(<AdminModal modal={modalPayout} bounty={bounty} />);

      // ACT
      await waitFor(() => {
        const heading = screen.getByText('Payout Updated!');
        const text = screen.getByText('Payout set to:');
        const amount = screen.getByText(/1.0 MATIC/i);
        const btn = screen.getByTestId('link', { name: 'Tweet about it' });

        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(amount).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      });
    });

    it('should show Closed contract for split price contracts', async () => {
      // ARRANGE
      render(<AdminModal modal={modalCloseSplitPrice} bounty={bounty} />);

      // ACT
      await waitFor(() => {
        const heading = screen.getByText('Split Price Contract Closed!');
        const btn = screen.getByRole('button', { name: 'Close' });

        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      });
    });

    it('should show Set New Payout Schedule on Contest contracts', async () => {
      // ARRANGE
      render(<AdminModal payoutTokenAddress={zeroAddress} modal={modalContest} bounty={bounty} />);

      // ACT
      await waitFor(() => {
        const heading = screen.getByText('Payout Schedule Updated!');
        const text = screen.getByText('Payout Schedule set to:');
        const btn = screen.getByTestId('link', { name: 'Tweet about it' });

        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      });
    });
  };
  test();
});
