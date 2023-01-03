/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import ClaimLoadingModal from '.';
import axios from 'axios';
import InitialState from '../../../store/Store/InitialState';

import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../ClaimStates';
import Constants from '../../../test-utils/constant';

describe('ClaimLoadingModal', () => {
  jest.mock('axios');
  axios.get = jest.fn().mockResolvedValue({ data: { data: 'true' } });

  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  const bounty = Constants.bounty;
  const claimBounty = jest.fn();
  const url = 'www.example.com';
  const ensName = 'voyageur.eth';
  const error = 'My brain cell was fried';
  const transactionHash = '0xyeet';
  const account = '0xpoly';
  const updateModal = jest.fn();
  it('should display checking elgibility', async () => {
    // ARRANGE
    const claimState = CHECKING_WITHDRAWAL_ELIGIBILITY;
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/Checking that you are indeed/i)).toBeInTheDocument();
    expect(screen.getByText(/validating claim/i)).toBeInTheDocument();
    expect(screen.getByText(/0xpol/)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display inelgible', async () => {
    // ARRANGE
    const claimBounty = jest.fn();
    const url = 'www.example.com';
    const ensName = 'voyageur.eth';
    const error = 'My brain cell was fried';
    const claimState = WITHDRAWAL_INELIGIBLE;
    const transactionHash = '0xyeet';
    const account = '0xpoly';
    const updateModal = jest.fn();
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/Withdrawal Ineligible/i)).toBeInTheDocument();
    expect(screen.getByText(/You are NOT the droid/i)).toBeInTheDocument();

    expect(screen.getByText(/No linked PR/)).toBeInTheDocument();
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it('should display completed transaction', async () => {
    const claimState = TRANSACTION_CONFIRMED;
    // ARRANGE
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/Funds from this payout will appear in your address soon./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Transaction confirmed! Funds from this payout will appear in your address soon./)
    ).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it('should display transaction submitted', async () => {
    const claimState = TRANSACTION_SUBMITTED;
    // ARRANGE
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/You are indeed the/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(screen.getByText(/Transaction Submitted/)).toBeInTheDocument();
    expect(nullish).toHaveLength(0);
  });
  it('should display transaction submitted', async () => {
    const claimState = TRANSACTION_SUBMITTED;
    // ARRANGE
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/You are indeed the/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(screen.getByText(/Transaction Submitted/)).toBeInTheDocument();
    expect(nullish).toHaveLength(0);
  });

  it('should display transaction submitted', async () => {
    const error = { title: 'Potato', message: 'My brain cell was fried' };
    const claimState = TRANSACTION_SUBMITTED;
    // ARRANGE
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/You are indeed the/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(screen.getByText(/Transaction Submitted/)).toBeInTheDocument();
    expect(nullish).toHaveLength(0);
  });

  it('should display checking elgibility', async () => {
    const claimState = CONFIRM_CLAIM;
    // ARRANGE
    render(
      <ClaimLoadingModal
        confirmMethod={claimBounty}
        url={url}
        ensName={ensName}
        account={account}
        error={error}
        claimState={claimState}
        address={account}
        transactionHash={transactionHash}
        setShowClaimLoadingModal={updateModal}
        authState={Constants.authState}
        bounty={bounty}
      />
    );

    // ASSERT
    expect(screen.getByText(/Do you want to claim these rewards?/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
