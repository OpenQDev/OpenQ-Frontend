/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminModal from '../../components/Admin/AdminModal';
import InitialState from '../../store/Store/InitialState';
import { waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';

describe('AdminModal', () => {
  const bounty = {
    id: 'I_kwDOGWnnz85GjwA1',
    title: 'Properly Referenced and Merged by FlacoJones',
    assignees: [
      {
        __typename: 'User',
        name: 'Christopher Stevers',
        login: 'Christopher-Stevers',
        url: 'https://github.com/Christopher-Stevers',
        avatarUrl: 'https://avatars.githubusercontent.com/u/72156679?u=7e821e3f2a1f88c0f4a134eec159189f9c3e7367&v=4',
      },
    ],
    body: '',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/136',
    repoName: 'OpenQ-TestRepo',
    closedAt: '2022-03-28T17:57:44Z',
    owner: 'OpenQDev',
    avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
    labels: [],
    createdAt: '2022-03-28T17:46:36Z',
    closed: true,
    bodyHTML: '',
    titleHTML: 'Properly Referenced and Merged by FlacoJones',
    twitterUsername: 'openqlabs',
    number: 136,
    prs: [
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-03-28T17:47:26Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-03-28T17:57:44Z',
          url: 'https://github.com/OpenQDev/OpenQ-TestRepo/pull/138',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'FlacoJones',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
            url: 'https://github.com/FlacoJones',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?v=4',
              name: 'FlacoJones',
              user: { __typename: 'User', login: 'FlacoJones', url: 'https://github.com/FlacoJones' },
            },
          },
        },
      },
    ],
    closedEvents: [
      {
        __typename: 'ClosedEvent',
        id: 'CE_lADOGWnnz85GjwA1zwAAAAF4vHFc',
        actor: {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
          login: 'FlacoJones',
          url: 'https://github.com/FlacoJones',
          name: null,
        },
      },
    ],
    __typename: 'Bounty',
    tvl: 9.51848,
    bountyId: 'I_kwDOGWnnz85GjwA1',
    bountyAddress: '0x29bdcbc116f3775698ae0ffe5f8fbbaf95f240cf',
    closerData: null,
    bountyMintTime: '1662545344',
    bountyClosedTime: null,
    fundingGoalVolume: '100',
    fundingGoalTokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    payoutTokenVolume: null,
    payoutTokenAddress: null,
    payoutSchedule: null,
    claims: [],
    payouts: [],
    claimedTransactionHash: null,
    payoutAddress: null,
    status: '0',
    bountyType: '0',
    closer: null,
    deposits: [
      {
        id: '0xe5551a3fa87d93a0c6c084d572b9e282114befc43dc68f08be6d53d13830e356',
        refunded: false,
        receiveTime: '1662545374',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '1296000',
        volume: '1000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
        refunded: true,
        receiveTime: '1662545373',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        expiration: '30',
        volume: '2000000000000000000',
        refundTime: '1662559726',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x7db2691e573b9c19e90f391cd3eda9ce9246666a1502f2bf87b9d47d13679bc0',
        refunded: false,
        receiveTime: '1662545372',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        expiration: '1296000',
        volume: '1000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
    ],
    refunds: [
      {
        refundTime: '1662559726',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '2000000000000000000',
        depositId: '0xb4f31aab8a1c4bfe26236729e8cd8e4abf81d63283e006b4ec677a7ce6b2871a',
        __typename: 'Refund',
      },
    ],
    bountyTokenBalances: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '1000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
      {
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '1000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
    ],
    issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
  };
  const modalBudget = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Budget',
  };

  const modalPayout = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Payout',
  };

  const modalCloseSplitPrice = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Closed Split Price',
  };

  const modalContest = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'PayoutSchedule',
    finalTierVolume: [70, 20, 10],
  };

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
  const test = () => {
    it('should show Budget updated', async () => {
      // ARRANGE
      render(<AdminModal modal={modalBudget} bounty={bounty} />);
      await waitFor(() => {
        // ACT
        const heading = screen.getByText('Budget Updated!');
        const text = screen.getByText('Budget set to:');
        const amount = screen.getByText(/1.0 MATIC/i);
        const btn = screen.getByRole('link', { name: 'Tweet about it' });

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
        const btn = screen.getByRole('link', { name: 'Tweet about it' });

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
      render(<AdminModal modal={modalContest} bounty={bounty} />);

      // ACT
      await waitFor(() => {
        const heading = screen.getByText('Payout Schedule Updated!');
        const text = screen.getByText('Payout Schedule set to:');
        const btn = screen.getByRole('link', { name: 'Tweet about it' });

        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      });
    });
  };
  test();
});
