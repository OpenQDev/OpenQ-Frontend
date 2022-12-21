/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import axios from 'axios';
import InitialState from '../../store/Store/InitialState';

import { CONFIRM, APPROVING, TRANSFERRING, ERROR } from '../../components/FundBounty/ApproveFundState';
import ApproveFundModal from '../../components/FundBounty/ApproveFundModal';
import FundContext from '../../components/FundBounty/FundContext';
import userEvent from '@testing-library/user-event';
import InitialFundState from '../../components/FundBounty/InitialFundState';
import Constants from '../../test-utils/constant';

describe('ApproveFundModal', () => {
  jest.mock('axios');
  axios.get = jest.fn().mockResolvedValue({ data: { data: 'true' } });

  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  const bounty = Constants.bounty;
  const fundBounty = jest.fn();
  const refreshBounty = jest.fn();

  const fundState = {
    ...InitialFundState,
    refreshBounty,
    volume: '3',

    approveTransferState: CONFIRM,
    bounty,
  };
  const fundDispatch = jest.fn();

  it('should display checking elgibility', async () => {
    // ARRANGE
    render(
      <FundContext.Provider value={[fundState, fundDispatch]}>
        <ApproveFundModal confirmMethod={fundBounty} />
      </FundContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/3 MATIC/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display confirm state of modal and let user trigger state change', async () => {
    const confirmFundState = {
      ...fundState,
      volume: '3',

      approveTransferState: CONFIRM,
    };
    // ARRANGE
    const user = userEvent.setup();
    render(
      <FundContext.Provider value={[confirmFundState, fundDispatch]}>
        <ApproveFundModal confirmMethod={fundBounty} />
      </FundContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/Confirm/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fund' }));
    expect(fundBounty).toHaveBeenCalled();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display transfer state', async () => {
    // ARRANGE
    const transferFundState = {
      ...fundState,
      approveTransferState: TRANSFERRING,
    };
    render(
      <FundContext.Provider value={[transferFundState, fundDispatch]}>
        <ApproveFundModal confirmMethod={fundBounty} />
      </FundContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/Transferring Deposit.../i)).toBeInTheDocument();
    expect(screen.getByText(/Funding.../i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display approve state', async () => {
    // ARRANGE

    const approveFundState = {
      ...fundState,
      approveTransferState: APPROVING,
    };
    render(
      <FundContext.Provider value={[approveFundState, fundDispatch]}>
        <ApproveFundModal confirmMethod={fundBounty} />
      </FundContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/Approving Deposit.../i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display error state', async () => {
    // ARRANGE
    const error = {
      message: 'Nonce too high',
      title: 'My brain cell was fried',
    };
    const errorFundState = {
      ...fundState,
      error,
      approveTransferState: ERROR,
    };
    render(
      <FundContext.Provider value={[errorFundState, fundDispatch]}>
        <ApproveFundModal confirmMethod={fundBounty} />
      </FundContext.Provider>
    );

    // ASSERT
    expect(screen.getByText(/Nonce too high/)).toBeInTheDocument();
    expect(screen.getByText(/My brain cell was fried/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
