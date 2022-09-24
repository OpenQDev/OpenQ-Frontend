/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import { waitFor } from '@testing-library/react';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', () => {
  const tokenValues = {
    tokenPrices: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 0.67 },
    tokens: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 8.040000000000001 },
    total: 8.04,
  };

  it('should display bubles in correct order', async () => {
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
            avatarUrl:
              'https://avatars.githubusercontent.com/u/93455288?u=fd1fb04b6ff2bf397f8353eafffc3bfb4bd66e84&v=4',
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
    // Arrange
    render(
      <BountyCardDetails
        bounty={bounty}
        address={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
        tokenValues={tokenValues}
      />
    );

    // ASSERT
    await waitFor(() => {
      // gets actions as array
      const actions = screen.getAllByTestId('actionTitle');

      //gets actions individually
      const refundAction = screen.getByText(
        /0xf3\.\.\.2266 refunded a deposit of 2\.0 DERC20 \(\$1\.34\) on September 7, 2022 at 14:08/i
      );
      const fundActionOne = screen.getByText(
        /0xf3\.\.\.2266 funded this contract with 1\.0 MATIC \(\$0\.67\) on September 7, 2022 at 10:09/i
      );
      const fundActionTwo = screen.getByText(
        /funded this contract with 2\.0 DERC20 \(\$1\.34\) on September 7, 2022 at 10:09/i
      );
      const fundActionThree = screen.getByText(
        /funded this contract with 1\.0 LINK \(\$0\.67\) on September 7, 2022 at 10:09/i
      );
      const mergeAction = screen.getByText(/FlacoJones merged linked pull request/i);
      const closedAction = screen.getByText(/FlacoJones closed this issue on March 28, 2022 at 17:57/i);
      const linkedAction = screen.getByText(/FlacoJones linked/i);
      const mintedAction = screen.getByText(/0xf3\.\.\.2266 minted this contract on September 7, 2022 at 10:09/i);

      //orders individual actions into a correctly ordered array.
      const orderedActions = [
        refundAction,
        fundActionOne,
        fundActionTwo,
        fundActionThree,
        mergeAction,
        closedAction,
        linkedAction,
        mintedAction,
      ];
      // checks if array of actions is ordered properly
      orderedActions.forEach((action, index) => {
        expect(action).toEqual(actions[index]);
      });
    });
  });
});
