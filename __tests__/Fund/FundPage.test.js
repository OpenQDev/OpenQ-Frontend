/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import FundPage from '../../components/FundBounty/FundPage';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';

describe('FundPage', () => {
  const bounty = {
    id: 'I_kwDOGAqhQc48U5_r',
    title: 'test2',
    body: 'body of test2',
    url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/8',
    languages: [
      { __typename: 'Language', name: 'JavaScript', color: '#f1e05a' },
      { __typename: 'Language', name: 'CSS', color: '#563d7c' },
      { __typename: 'Language', name: 'Dockerfile', color: '#384d54' },
      { __typename: 'Language', name: 'Shell', color: '#89e051' },
    ],
    repoName: 'OpenQ-Frontend',
    owner: 'OpenQDev',
    avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
    labels: [
      { __typename: 'Label', name: 'documentation', color: '0075ca' },
      { __typename: 'Label', name: 'duplicate', color: 'cfd3d7' },
      { __typename: 'Label', name: 'enhancement', color: 'a2eeef' },
      { __typename: 'Label', name: 'wontfix', color: 'ffffff' },
      { __typename: 'Label', name: 'javascript', color: 'E16391' },
      { __typename: 'Label', name: 'bounty', color: '727384' },
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

  const refreshBounty = () => {
    return null;
  };
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));

    InitialState.openQClient.reset();
    InitialState.shouldSleep = 200;
  });

  it('should render the heading', () => {
    // ARRANGE
    render(<FundPage bounty={bounty} />);

    // ACT
    const heading = screen.getByText('Fund');
    // ASSERT
    expect(heading).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });

  it('should render list items', () => {
    // ARRANGE
    render(<FundPage bounty={bounty} />);

    // ACT
    const token = screen.getByText('MATIC');

    // ASSERT
    expect(token).toBeInTheDocument();
  });

  it('should let user submit and handle too low amount of token', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '200');
    const button = screen.getByRole('button', { name: /Fund/i });
    await user.click(button);
    const confirmBtn = await screen.findAllByRole('button', { name: /Fund/i });
    await user.click(confirmBtn[1]);
    const modalContent = await screen.findByText(/Too Low/i);

    // ASSERT
    expect(modalContent).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should let user submit and handle owned amount of Matic', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '3');
    const button = screen.getByRole('button', { name: /Fund/i });
    await user.click(button);
    const value = await screen.findByText(/3 Matic/i);

    // ASSERT
    expect(value).toBeInTheDocument();
    const confirmBtn = await screen.findAllByRole('button', { name: /Fund/i });
    await user.click(confirmBtn[1]);
    const modalContent = await screen.findByText(/Transfer Complete/i);
    const tweet = screen.getByText('Tweet about it');
    expect(tweet).toBeInTheDocument();
    await user.click(screen.getByTestId('cross'));
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should let user submit and handle owned amount of Link', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '0.30sdf');
    await user.click(screen.getByText(/Matic/i));
    await user.click(screen.getAllByText(/link/i)[0]);
    const button = screen.getByRole('button', { name: /Fund/i });
    await user.click(button);
    const value = await screen.findByText(/.3 link/i);

    // ASSERT
    expect(value);
    const confirmBtn = await screen.findByRole('button', { name: /Approv/i });
    await user.click(confirmBtn);
    const funding = await screen.findByText('Funding...');
    expect(funding).toBeInTheDocument();
    const modalContent = await screen.findByText(/Transfer Complete/i, undefined, {
      timeout: 4000,
    });
    const tweet = screen.getByText('Tweet about it');
    expect(tweet).toBeInTheDocument();
    await user.click(screen.getByTestId('cross'));
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should go straight to fund when DERC20 approved previously', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '4.8');
    await user.click(screen.getByText(/Matic/i));
    await user.click(screen.getAllByText(/derc20/i)[0]);
    const button = screen.getByRole('button', { name: /Fund/i });
    await user.click(button);
    const value = await screen.findByText(/4.8 derc20/i);

    // ASSERT
    expect(value).toBeInTheDocument();
    const confirmBtn = await screen.findAllByRole('button', { name: /Fund/i });
    await user.click(confirmBtn[1]);
    const modalContent = await screen.findByText(/Transfer Complete/i);
    const tweet = screen.getByText('Tweet about it');
    expect(tweet).toBeInTheDocument();
    await user.click(screen.getByTestId('cross'));
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should handle approval errors', async () => {
    // ARRANGE
    InitialState.openQClient.shouldError = true;
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '0.30sdf');
    await user.click(await screen.findByText(/MATIC/i));
    await user.click(screen.getAllByText(/Chainlink/i)[0]);
    const button = await screen.findByRole('button', { name: /Fund/i });
    await user.click(button);

    // ASSERT
    expect(await screen.findByText(/0.3 LINK/));
    await user.click(await screen.findByRole('button', { name: /Approv/i }));
    const modalContent = await screen.findByText(/try again./i);
    expect(modalContent).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Close' }));
    expect(modalContent).not.toBeInTheDocument();
  });

  it('should prevent user from submitting over 10000000', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '10000000');
    const button = await screen.findByRole('button', { name: /Fund/i });

    // ASSERT
    expect(button).toBeDisabled();
    await user.hover(button);
    const tooltip = await screen.findByText(/Must be between/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should prevent user from submitting under 0.0000001', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} />);

    // ACT
    const input = screen.getByLabelText('amount');
    await user.type(input, '0.00000001');
    const button = await screen.findByRole('button', { name: /Fund/i });

    // ASSERT
    expect(button).toBeDisabled();
    await user.hover(button);
    const tooltip = await screen.findByText(/Must be between/);
    expect(tooltip).toBeInTheDocument();
  });

  it('should show tooltip', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<FundPage bounty={bounty} />);

    // ACT / ASSERT
    const button = screen.getByRole('button', { name: /Fund/i });
    expect(button).toBeDisabled();
    await user.hover(button);
    const tooltip = await screen.findByText(/indicate the volume you'd like to fund with./i);
    expect(tooltip).toBeInTheDocument();
  });
});
