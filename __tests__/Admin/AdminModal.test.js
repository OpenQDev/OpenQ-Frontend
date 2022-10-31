/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import axios from 'axios';
import InitialState from '../../store/Store/InitialState';

import AdminModal from '../../components/Admin/AdminModal';
describe('AdminModal', () => {
  jest.mock('axios');
  axios.get = jest.fn().mockResolvedValue({ data: { data: 'true' } });

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

    // ASSERT
    expect(screen.getByText(/Split Price Contract Closed!/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
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

    // ASSERT
    expect(screen.getByText(/Budget updated/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget set to:/i)).toBeInTheDocument();
    expect(screen.getByText(/0xa...adf/)).toBeInTheDocument();
    expect(screen.getByText('10.0 MATIC')).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
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

    // ASSERT
    expect(screen.getByText(/Payout updated/i)).toBeInTheDocument();
    expect(screen.getByText(/Payout set to:/i)).toBeInTheDocument();
    expect(screen.getByText(/0xa...adf/)).toBeInTheDocument();
    expect(screen.getByText('10.0 MATIC')).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
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

    // ASSERT
    expect(screen.getByText(/1 MATIC/)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
