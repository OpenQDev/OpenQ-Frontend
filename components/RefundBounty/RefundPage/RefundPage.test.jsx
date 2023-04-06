/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import RefundPage from './RefundPage';
import InitialState from '../../store/Store/InitialState';

describe('RefundPage', () => {
  const bounty = {
    id: 'I_kwDOCQWAHM5EzBw7',
    title: 'Multicall supports writing function calls?',
    assignees: [],
    body: "In the multicall.sol contract: https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7\r\n```\r\nAggregate results from multiple read-only function calls\r\n```\r\n\r\nAs far as I'm aware, it supports writing to function calls.  Is this correct? I believe this comment is wrong where it says `read-only`?\r\nAnd it does not support `payable` or passing `msg.value`?\r\n\r\n",
    url: 'https://github.com/makerdao/multicall/issues/40',
    repoName: 'multicall',
    owner: 'makerdao',
    avatarUrl: 'https://avatars.githubusercontent.com/u/12523025?v=4',
    labels: [],
    createdAt: '2022-02-28T15:27:18Z',
    closed: false,
    bodyHTML:
      '<p dir="auto">In the multicall.sol contract: <a href="https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7">https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7</a></p>\n<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="Aggregate results from multiple read-only function calls"><pre class="notranslate notranslate"><code>Aggregate results from multiple read-only function calls\n</code></pre></div>\n<p dir="auto">As far as I\'m aware, it supports writing to function calls.  Is this correct? I believe this comment is wrong where it says <code class="notranslate">read-only</code>?<br>\nAnd it does not support <code class="notranslate">payable</code> or passing <code class="notranslate">msg.value</code>?</p>',
    titleHTML: 'Multicall supports writing function calls?',
    twitterUsername: null,
    number: 40,
    prs: [],
    __typename: 'Bounty',
    tvl: 0,
    bountyId: 'I_kwDOCQWAHM5EzBw7',
    bountyAddress: '0xae71d223b7508877f4562939709326e2371c632e',
    closerData: null,
    bountyMintTime: '1662372831',
    bountyClosedTime: null,
    fundingGoalVolume: '100',
    fundingGoalTokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    payoutTokenVolume: null,
    payoutTokenAddress: null,
    payoutSchedule: ['70', '20', '10'],
    claims: [],
    payouts: [],
    claimedTransactionHash: null,
    payoutAddress: null,
    status: '0',
    bountyType: '2',
    closer: null,
    deposits: [
      {
        id: '0xbf3f0b23ed5abb06f6ea2bdc516729d30cd5e9731a7a31ef77ef5382488455b2',
        refunded: false,
        receiveTime: '1662395968',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '1',
        volume: '23000000000000000000',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x8f5c1c912b8ffca325a22eadb33d6d54fa8e85b3752f2392eb54ecc6dd24b1e1',
        refunded: false,
        receiveTime: '1762395948',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '2592000',
        volume: '23000000000000000000',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x9c5e530511dff239da2c1c1205649aaa24fe2cc797d583a162744f26d623726a',
        refunded: false,
        receiveTime: '1762395897',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '2592000',
        volume: '23000000000000000000',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
    ],
    refunds: [],
    bountyTokenBalances: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '69000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
    ],
    issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
  };
  const depWithRefund = {
    id: 'I_kwDOCQWAHM5EzBw7',
    title: 'Multicall supports writing function calls?',
    assignees: [],
    body: "In the multicall.sol contract: https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7\r\n```\r\nAggregate results from multiple read-only function calls\r\n```\r\n\r\nAs far as I'm aware, it supports writing to function calls.  Is this correct? I believe this comment is wrong where it says `read-only`?\r\nAnd it does not support `payable` or passing `msg.value`?\r\n\r\n",
    url: 'https://github.com/makerdao/multicall/issues/40',
    repoName: 'multicall',
    owner: 'makerdao',
    avatarUrl: 'https://avatars.githubusercontent.com/u/12523025?v=4',
    labels: [],
    createdAt: '2022-02-28T15:27:18Z',
    closed: false,
    bodyHTML:
      '<p dir="auto">In the multicall.sol contract: <a href="https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7">https://github.com/makerdao/multicall/blob/master/src/Multicall.sol#L7</a></p>\n<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="Aggregate results from multiple read-only function calls"><pre class="notranslate notranslate"><code>Aggregate results from multiple read-only function calls\n</code></pre></div>\n<p dir="auto">As far as I\'m aware, it supports writing to function calls.  Is this correct? I believe this comment is wrong where it says <code class="notranslate">read-only</code>?<br>\nAnd it does not support <code class="notranslate">payable</code> or passing <code class="notranslate">msg.value</code>?</p>',
    titleHTML: 'Multicall supports writing function calls?',
    twitterUsername: null,
    number: 40,
    prs: [],
    __typename: 'Bounty',
    tvl: 0,
    bountyId: 'I_kwDOCQWAHM5EzBw7',
    bountyAddress: '0xae71d223b7508877f4562939709326e2371c632e',
    closerData: null,
    bountyMintTime: '1662372831',
    bountyClosedTime: null,
    fundingGoalVolume: '100',
    fundingGoalTokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    payoutTokenVolume: null,
    payoutTokenAddress: null,
    payoutSchedule: ['70', '20', '10'],
    claims: [],
    payouts: [],
    claimedTransactionHash: null,
    payoutAddress: null,
    status: '0',
    bountyType: '2',
    closer: null,
    deposits: [
      {
        id: '0xbf3f0b23ed5abb06f6ea2bdc516729d30cd5e9731a7a31ef77ef5382488455b2',
        refunded: true,
        receiveTime: '1662395968',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '1',
        volume: '23000000000000000000',
        refundTime: '1662407371',
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x8f5c1c912b8ffca325a22eadb33d6d54fa8e85b3752f2392eb54ecc6dd24b1e1',
        refunded: false,
        receiveTime: '1662395948',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '2592000',
        volume: '23000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
      {
        id: '0x9c5e530511dff239da2c1c1205649aaa24fe2cc797d583a162744f26d623726a',
        refunded: false,
        receiveTime: '1662395897',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        expiration: '2592000',
        volume: '23000000000000000000',
        refundTime: null,
        sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
        __typename: 'Deposit',
      },
    ],
    refunds: [
      {
        refundTime: '1662407371',
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '23000000000000000000',
        __typename: 'Refund',
      },
    ],
    bountyTokenBalances: [
      {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        volume: '46000000000000000000',
        __typename: 'BountyFundedTokenBalance',
      },
    ],
    issuer: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
  };
  const isoDate = 1662396272728;
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor() {
      super();
      return new RealDate(isoDate);
    }
  };

  beforeEach(() => {
    InitialState.openQClient.reset();
  });

  const test = (bounty) => {
    it('should render the heading', async () => {
      // ARRANGE
      render(<RefundPage bounty={bounty} />);
      let heading = await screen.findByText('My Deposits');

      // ASSERT
      expect(heading).toBeInTheDocument();
    });

    it('should render refundable', async () => {
      // ARRANGE
      render(<RefundPage bounty={bounty} />);
      let heading = await screen.findByText('My Deposits');
      const refundBtn = await screen.findByRole('button', { name: /Refund/i });
      const extendBtn = await screen.findAllByRole('button', { name: /Extend/i });

      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(refundBtn).toBeInTheDocument();
      expect(extendBtn).toHaveLength(3);

      // ASSERT
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
    it('should render times, including not yet refundable times', async () => {
      // ARRANGE
      render(<RefundPage bounty={bounty} />);

      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      // ASSERT
      expect(nullish).toHaveLength(0);
      expect(screen.getAllByText(/Refundable on: September 5, 2022 at 16:44/)).toHaveLength(3);
    });

    it('should render refunded', async () => {
      // ARRANGE
      render(<RefundPage bounty={depWithRefund} />);
      let heading = await screen.findByText('My Deposits');

      // ASSERT
      expect(heading).toBeInTheDocument();
      // ASSERT
      expect(screen.getAllByText(/Refunded on: September 5, 2022 at 16:44/)).toHaveLength(1);
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test(bounty);
});
