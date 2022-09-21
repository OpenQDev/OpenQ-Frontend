/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ClaimLoadingModal from '../../components/Claim/ClaimLoadingModal';
import axios from 'axios';
import InitialState from '../../store/Store/InitialState';
import userEvent from '@testing-library/user-event';

import {
  CHECKING_WITHDRAWAL_ELIGIBILITY,
  WITHDRAWAL_INELIGIBLE,
  TRANSACTION_SUBMITTED,
  TRANSACTION_CONFIRMED,
  CONFIRM_CLAIM,
} from '../../components/Claim/ClaimStates';

describe('ClaimLoadingModal', () => {
  const bounty = {
    __typename: 'Bounty',
    bountyAddress: '0x1f191c4166865882b26551fb8618668b7a67d0fb',
    bountyId: 'I_kwDOBC3Cis5Kk2OD',
    bountyMintTime: '1654260766',
    bountyClosedTime: null,
    status: 'OPEN',
    bountyType: '2',
    payoutSchedule: ['70', '20', '10'],
    claimedTransactionHash: null,
    deposits: [],
    issuer: {
      __typename: 'User',
      id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    },
    bountyTokenBalances: [],
  };
  jest.mock('axios');
  axios.get = jest.fn().mockResolvedValue({ data: { data: 'true' } });

  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should display checking elgibility', async () => {
    // ARRANGE
    const claimBounty = jest.fn();
    const url = 'www.example.com';
    const ensName = 'voyageur.eth';
    const error = 'My brain cell was fried';
    const claimState = CHECKING_WITHDRAWAL_ELIGIBILITY;
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
      />
    );

    // ASSERT
    expect(screen.getByText(/Checking that you are indeed/i)).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
