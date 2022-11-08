/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ActionBubble from '../../components/Utils/ActionBubble';
import nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
// Test cases for full balances, empty balances, and undefined balances.

nextRouter.useRouter = jest.fn();
const push = jest.fn(() => {
  return { catch: jest.fn };
});
const bounty = {
  id: 'I_kwDOGAqhQc48U5_r',
  title: 'test2',
  body: 'body of test2',
  url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/8',
  languages: [
    {
      __typename: 'Language',
      name: 'JavaScript',
      color: '#f1e05a',
    },
    { __typename: 'Language', name: 'CSS', color: '#563d7c' },
    { __typename: 'Language', name: 'Dockerfile', color: '#384d54' },
    { __typename: 'Language', name: 'Shell', color: '#89e051' },
  ],
  repoName: 'OpenQ-Frontend',
  owner: 'OpenQDev',
  avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
  labels: [
    {
      __typename: 'Label',
      name: 'documentation',
      color: '0075ca',
    },
    {
      __typename: 'Label',
      name: 'duplicate',
      color: 'cfd3d7',
    },
    {
      __typename: 'Label',
      name: 'enhancement',
      color: 'a2eeef',
    },
    {
      __typename: 'Label',
      name: 'wontfix',
      color: 'ffffff',
    },
    {
      __typename: 'Label',
      name: 'javascript',
      color: 'E16391',
    },
    {
      __typename: 'Label',
      name: 'bounty',
      color: '727384',
    },
  ],
  createdAt: '1661767948472',
  closed: true,
  bodyHTML: '<p dir="auto">body of test2</p>',
  titleHTML: 'test2',
  assignees: [],
  number: 8,
  repoUrl: 'https://github.com/OpenQDev/OpenQ-Frontend',
  repoDescription: null,
  prs: [],
  __typename: 'Bounty',
  bountyAddress: '0x3c57cd59335d9a56b76feb48b3925d095e7e8e9f',
  bountyId: 'I_kwDOGAqhQc48U5_r',
  bountyMintTime: '1661767971',
  bountyClosedTime: null,
  status: '0',
  fundingGoalTokenAddress: '0x0000000000000000000000000000000000000000',
  fundingGoalVolume: '0',
  payoutTokenVolume: '100',
  payoutTokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  payoutSchedule: null,
  closerData: null,
  bountyType: '1',
  claimedTransactionHash: null,
  deposits: [
    {
      __typename: 'Deposit',
      id: '0x5fad7d4850474383e594afa53cedd57709f994d3da7787d72ecd4d4f0b6e1264',
      refunded: false,
      refundTime: null,
      expiration: '30',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      volume: '2000000000000000000',
      sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
      receiveTime: '1661768003',
    },
    {
      __typename: 'Deposit',
      id: '0xc468cf93bc351051c605130e29dd256ed200bd2d42f598d5dc1cb2b19ddd1743',
      refunded: false,
      refundTime: null,
      expiration: '30',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '1000000000000000000',
      sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
      receiveTime: '1661768000',
    },
    {
      __typename: 'Deposit',
      id: '0xc584d8d700359e89dbae47c6e6bf293d21ce250b67cc6b679636d0453cb86884',
      refunded: false,
      refundTime: null,
      expiration: '1296000',
      tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
      volume: '2000000000000000000',
      sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
      receiveTime: '1661768002',
    },
    {
      __typename: 'Deposit',
      id: '0xf01aecc05f1e304ffaacb3ed1af91d23fd4be565e7b376660efa2916cf657f44',
      refunded: false,
      refundTime: null,
      expiration: '30',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '1000000000000000000',
      sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
      receiveTime: '1661768001',
    },
  ],
  refunds: [],
  payouts: [],
  issuer: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
  bountyTokenBalances: [
    {
      __typename: 'BountyFundedTokenBalance',
      volume: '2000000000000000000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
    {
      __typename: 'BountyFundedTokenBalance',
      volume: '2000000000000000000',
      tokenAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    },
    {
      __typename: 'BountyFundedTokenBalance',
      volume: '2000000000000000000',
      tokenAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    },
  ],
  tvl: 0,
  address: '0x3C57cD59335D9a56b76fEB48b3925D095e7e8E9f',
  organizationId: 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4',
  type: '1',
  category: null,
  watchingCount: 0,
  blacklisted: false,
  organization: { blacklisted: false, __typename: 'Organization' },
};

describe('ActionBubble', () => {
  // Test cases for

  beforeEach(() => {
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
      push,
    }));
  });

  it('should display minted message', async () => {
    // ARRANGE

    render(<ActionBubble bounty={bounty} />);
    // ASSERT
    expect(await screen.findByText('0xf3...2266 minted this contract on August 29, 2022 at 10:12.'));
    expect(screen.getByText(/body of test2/i)).toBeInTheDocument();
  });

  it('should display minted links', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ActionBubble bounty={bounty} />);
    // ASSERT
    const link = await screen.findByTestId('link');
    await user.hover(link);
    expect(screen.getByText('0xf3...2266 minted this contract on August 29, 2022 at 10:12.'));
  });

  it('should display funded action message', async () => {
    // ARRANGE

    const action = {
      receiveTime: 200000,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      depositId: '0x5fad7d4850474383e594afa53cedd57709f994d3da7787d72ecd4d4f0b6e1264',
      volume: '10000000000000000000',
    };
    render(<ActionBubble action={action} bounty={bounty} />);

    // ASSERT
    expect(
      await screen.findByText('0xf3...2266 funded this contract with 10.0 MATIC ($6.70) on January 3, 1970 at 7:33.')
    );
  });

  it('should display refunded action message', async () => {
    // ARRANGE

    const action = {
      refundTime: 200000,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '10000000000000000000',
      depositId: '0x5fad7d4850474383e594afa53cedd57709f994d3da7787d72ecd4d4f0b6e1264',
    };
    render(<ActionBubble action={{ ...action }} bounty={bounty} />);

    // ASSERT
    expect(await screen.findByText('0xf3...2266 refunded a deposit of 10.0 MATIC ($6.70) on January 3, 1970 at 7:33.'));
  });

  it('should display multi claimed action message', async () => {
    // ARRANGE

    const action = {
      claimTime: 200000,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '10000000000000000000',
      claimant: { id: '0x5fbdb2315678afecb367f032d93f642f64180aa3' },
    };
    render(<ActionBubble action={action} bounty={bounty} />);

    // ASSERT
    expect(await screen.findByText('0x5F...0aa3 made a claim of $0.00 on this contract on January 3, 1970 at 7:33.'));
  });
  it('should display single claimed action message', async () => {
    // ARRANGE

    const action = {
      claimTime: 200000,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '10000000000000000000',
      claimant: { id: '0x5fbdb2315678afecb367f032d93f642f64180aa3' },
    };
    render(<ActionBubble action={action} bounty={{ ...bounty, bountyType: '0' }} />);

    // ASSERT
    expect(await screen.findByText('0x5F...0aa3 claimed $0.00 on this contract on January 3, 1970 at 7:33.'));
  });
  it('should display closed action message', async () => {
    // ARRANGE

    const action = {
      closingTime: 200000,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '10000000000000000000',
      claimant: { id: '0x5fbdb2315678afecb367f032d93f642f64180aa3' },
    };
    render(<ActionBubble action={action} bounty={{ ...bounty, bountyType: '0' }} />);

    // ASSERT
    expect(await screen.findByText('0xf3...2266 closed this contract on January 3, 1970 at 7:33.'));
  });
  it('should display pull request linked action message', async () => {
    // ARRANGE
    const url = 'https://github.com/OpenQDev/OpenQ-Frontend/pull/720';
    const action = {
      referencedTime: 200000,

      author: {
        login: 'Christopher-Stevers',
        url: 'https://github.com/Christopher-Stevers',
        avatarUrl:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F72156679%3Fv%3D4&w=32&q=75',
      },

      title: 'update readme.md',
      url,
    };
    render(<ActionBubble action={action} bounty={{ ...bounty, bountyType: '0' }} />);

    // ASSERT
    expect(await screen.findByText(/Christopher-Stevers linked/));
    expect(screen.getAllByRole('link')[0].href).toBe(url);
  });
});
