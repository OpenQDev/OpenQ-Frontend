/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ClaimOverview from '../../components/Claim/ClaimOverview';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});

const bounties = [
  // contest bounty where participants claimed there prize out of 4
  // 3 tokens, 2 of which refunded
  {
    id: 'I_kwDOHlavZM5SG67Y',
    title: 'Claim and refund test',
    assignees: [],
    body: '',
    url: 'https://github.com/ArcAnya/OpenQ-TestRepo/issues/151',
    repoName: 'OpenQ-TestRepo',
    closedAt: '2022-09-19T08:00:54Z',
    owner: 'ArcAnya',
    avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
    labels: [],
    createdAt: '2022-09-19T07:47:35Z',
    closed: true,
    bodyHTML: '',
    titleHTML: 'Claim and refund test',
    twitterUsername: null,
    number: 151,
    prs: [
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T08:00:43Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T08:00:54Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/152',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T08:31:53Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T08:32:03Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/153',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T10:13:15Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T10:13:20Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/154',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T11:29:34Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T11:29:43Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/156',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T11:30:10Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T11:32:54Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/157',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
    ],
    closedEvents: [
      {
        __typename: 'ClosedEvent',
        id: 'CE_lADOHlavZM5SG67YzwAAAAG5wDVP',
        actor: {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
          login: 'ArcAnya',
          url: 'https://github.com/ArcAnya',
          name: 'Anya',
        },
      },
    ],
    __typename: 'Bounty',
    tvl: 227.1099,
    bountyId: 'I_kwDOHlavZM5SG67Y',
    bountyAddress: '0x066efd87027a4cc4a21c57467f224ef98241d774',
    closerData: '0x',
    bountyMintTime: '1663574217',
    bountyClosedTime: '1663574468',
    fundingGoalVolume: '0',
    fundingGoalTokenAddress: '0x0000000000000000000000000000000000000000',
    payoutTokenVolume: null,
    payoutTokenAddress: null,
    payoutSchedule: ['40', '30', '20', '10'],
    claims: [
      {
        claimTime: '1663576393',
        claimantAsset: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/153',
        claimant: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Claim',
      },
      {
        claimTime: '1663574512',
        claimantAsset: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/152',
        claimant: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Claim',
      },
    ],
    payouts: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
    ],
    claimedTransactionHash: '0xd5b4b8bb1d63dd6cde31becbf6655a6853f372fb50aee734941358321ce0c7a6',
    payoutAddress: null,
    status: '1',
    bountyType: '2',
    closer: null,
    deposits: [
      {
        id: '0xbc6320373186b91ff682a268399c0b804136ff6247de916e99846bd366dfd116',
        refunded: true,
        receiveTime: '1663574388',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: '1663576942',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x35928e182884e462c92f67a362ba6e577361700026e9e42eb89ca0274429e63d',
        refunded: true,
        receiveTime: '1663574375',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: '1663586108',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x072a0d08a13227048aba346149127215f26ad8a3479ba5ce2a2e7746760236fc',
        refunded: false,
        receiveTime: '1663574352',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
    ],
    refunds: [
      {
        refundTime: '1663586108',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '300000000000000000000',
        __typename: 'Refund',
      },
      {
        refundTime: '1663576942',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '300000000000000000000',
        __typename: 'Refund',
      },
    ],
    bountyTokenBalances: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '300000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
    ],
    issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
  },
  // bounty with 2 x 100 deposit of each token (3 tokens total)
  // 2 claimant addresses, one of which has claimed twice with same address
  // no refunds
  {
    id: 'I_kwDOHlavZM5SG67Y',
    title: 'Claim and refund test',
    assignees: [],
    body: '',
    url: 'https://github.com/ArcAnya/OpenQ-TestRepo/issues/151',
    repoName: 'OpenQ-TestRepo',
    closedAt: '2022-09-19T08:00:54Z',
    owner: 'ArcAnya',
    avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
    labels: [],
    createdAt: '2022-09-19T07:47:35Z',
    closed: true,
    bodyHTML: '',
    titleHTML: 'Claim and refund test',
    twitterUsername: null,
    number: 151,
    prs: [
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T08:00:43Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T08:00:54Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/152',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T08:31:53Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T08:32:03Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/153',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T10:13:15Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T10:13:20Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/154',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T11:29:34Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T11:29:43Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/156',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
      {
        __typename: 'CrossReferencedEvent',
        referencedAt: '2022-09-19T11:30:10Z',
        source: {
          __typename: 'PullRequest',
          mergedAt: '2022-09-19T11:32:54Z',
          url: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/157',
          merged: true,
          title: 'Update README.md',
          author: {
            __typename: 'User',
            login: 'ArcAnya',
            avatarUrl:
              'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
            url: 'https://github.com/ArcAnya',
          },
          mergeCommit: {
            __typename: 'Commit',
            author: {
              __typename: 'GitActor',
              avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?v=4',
              name: 'Anya',
              user: { __typename: 'User', login: 'ArcAnya', url: 'https://github.com/ArcAnya' },
            },
          },
        },
      },
    ],
    closedEvents: [
      {
        __typename: 'ClosedEvent',
        id: 'CE_lADOHlavZM5SG67YzwAAAAG5wDVP',
        actor: {
          __typename: 'User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/75732239?u=285a48b76fb74f9487a3f595002bdbd69522a151&v=4',
          login: 'ArcAnya',
          url: 'https://github.com/ArcAnya',
          name: 'Anya',
        },
      },
    ],
    __typename: 'Bounty',
    tvl: 227.1099,
    bountyId: 'I_kwDOHlavZM5SG67Y',
    bountyAddress: '0x066efd87027a4cc4a21c57467f224ef98241d774',
    closerData: '0x',
    bountyMintTime: '1663574217',
    bountyClosedTime: '1663574468',
    fundingGoalVolume: '0',
    fundingGoalTokenAddress: '0x0000000000000000000000000000000000000000',
    payoutTokenVolume: null,
    payoutTokenAddress: null,
    payoutSchedule: ['40', '30', '20', '10'],
    claims: [
      {
        claimTime: '1663576393',
        claimantAsset: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/153',
        claimant: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Claim',
      },
      {
        claimTime: '1663574512',
        claimantAsset: 'https://github.com/ArcAnya/OpenQ-TestRepo/pull/152',
        claimant: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Claim',
      },
    ],
    payouts: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '300000000000000000000',
        payoutTime: '1663576393',
        closer: { id: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
      {
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '400000000000000000000',
        payoutTime: '1663574512',
        closer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Payout',
      },
    ],
    claimedTransactionHash: '0xd5b4b8bb1d63dd6cde31becbf6655a6853f372fb50aee734941358321ce0c7a6',
    payoutAddress: null,
    status: '1',
    bountyType: '2',
    closer: null,
    deposits: [
      {
        id: '0xbc6320373186b91ff682a268399c0b804136ff6247de916e99846bd366dfd116',
        refunded: true,
        receiveTime: '1663574388',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: '1663576942',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x35928e182884e462c92f67a362ba6e577361700026e9e42eb89ca0274429e63d',
        refunded: true,
        receiveTime: '1663574375',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: '1663586108',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x072a0d08a13227048aba346149127215f26ad8a3479ba5ce2a2e7746760236fc',
        refunded: false,
        receiveTime: '1663574352',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '1',
        volume: '1000000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
    ],
    refunds: [
      {
        refundTime: '1663586108',
        tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        volume: '300000000000000000000',
        __typename: 'Refund',
      },
      {
        refundTime: '1663576942',
        tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        volume: '300000000000000000000',
        __typename: 'Refund',
      },
    ],
    bountyTokenBalances: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '300000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
    ],
    issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
  },
];

// ClaimOverview tests the structure of the table:
// tokenAddresses headings, row descriptions and display of claimants addresses

describe('ClaimOverview', () => {
  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should render the headings', async () => {
    // ARRANGE
    render(<ClaimOverview bounty={bounties[0]} />);

    // ASSERT
    // column headings
    const link = await screen.findByText('LINK');
    expect(link).toBeInTheDocument();
    const derc = await screen.findByText('DERC20');
    expect(derc).toBeInTheDocument();
    const matic = await screen.findByText('MATIC');
    expect(matic).toBeInTheDocument();
    const total = await screen.findByText('TOTAL');
    expect(total).toBeInTheDocument();

    // row descriptions
    const subTotal = await screen.findByText('SubTotal');
    expect(subTotal).toBeInTheDocument();
    const stillClaimable = await screen.findByText('Still Claimable');
    expect(stillClaimable).toBeInTheDocument();
    const refundable = await screen.findByText('of which currently');
    expect(refundable).toBeInTheDocument();
    const refunded = await screen.findByText('Refunded');
    expect(refunded).toBeInTheDocument();
    const totalDeposited = await screen.findByText('Total Deposited');
    expect(totalDeposited).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should display the claimants addresses', async () => {
    // ARRANGE
    render(<ClaimOverview bounty={bounties[0]} />);

    // ASSERT
    const claimant1 = await screen.findByText('0x3c...93bc');
    expect(claimant1).toBeInTheDocument();
    const claimant2 = await screen.findByText('0xf3...2266');
    expect(claimant2).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
