/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ApprovalTranferModal from '../../components/RefundBounty/ApproveTransferModal';
import { CONFIRM, APPROVING, SUCCESS, ERROR } from '../../components/RefundBounty/ApproveTransferState';
import InitialState from '../../store/Store/InitialState';

const approveTransferStates = [CONFIRM, APPROVING, SUCCESS, ERROR];
function depositExpired(deposit) {
  return parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000);
}
const currentDate = jest.getRealSystemTime();
const errors = [
  {
    title: 'User Denied Transaction',
    message: 'Thank You! Come Again!',
  },
];
const bounty = {
  id: 'I_kwDOGAqhQc48U5_r',
  title: 'test2',
  body: 'body of test2',
  url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/8',
  repoName: 'OpenQ-Frontend',
  owner: 'OpenQDev',
  avatarUrl: 'https://avatars.githubusercontent.com/u/77402538?v=4',
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
  closerData: null,
  bountyType: '1',
  claimedTransactionHash: null,
  deposits: [
    // expired deposit with MATIC used here:
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
    // locked deposit with MATIC used here:
    {
      __typename: 'Deposit',
      id: '0xf01aecc05f1e304ffaacb3ed1af91d23fd4be565e7b376660efa2916cf657f44',
      refunded: false,
      refundTime: null,
      expiration: '1296000',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      volume: '1000000000000000000',
      sender: { __typename: 'User', id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' },
      receiveTime: currentDate / 1000,
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

beforeEach(() => {
  InitialState.openQClient.reset();
});

const test = (approveTransferState, error) => {
  it('should render the modal for Extend Deposit on expired deposit', () => {
    const extendDays = 10;
    render(
      <ApprovalTranferModal
        approveTransferState={approveTransferState}
        error={error}
        extend={true}
        bounty={bounty}
        depositId={0xc468cf93bc351051c605130e29dd256ed200bd2d42f598d5dc1cb2b19ddd1743}
        depositExpired={depositExpired}
        depositPeriodDays={{ 0xc468cf93bc351051c605130e29dd256ed200bd2d42f598d5dc1cb2b19ddd1743: extendDays }}
        transactionHash={'0xdcc0dd02d34276a66e91254d54c1d91788b0d1d7200e70f27a1959d278f8f2f1'}
      />
    );

    // ASSERT
    let newDate = InitialState.utils.formatDate(currentDate + extendDays * 1000 * 60 * 60 * 24);
    let title;
    let line1 = screen.getByText('Deposit:');
    let amount = screen.getByText(/1.0 MATIC/i);
    let line2 = screen.getByText('Extend by:');
    let days = screen.getByText(/10 days/i);
    let line3 = screen.getByText('Locked until:');
    let date = screen.getByText(newDate);
    let line4 = screen.getByText('On address:');
    let address = screen.getByText(/0x3c5 ... e9f/i);
    let btnText;
    let msg;
    switch (approveTransferState) {
      case CONFIRM:
        title = screen.getByText('Extend Lock Period');
        msg = screen.getByText('Are you sure you want to extend this deposit?');
        btnText = screen.getByRole('button', { name: 'Yes, extend!' });
        break;
      case APPROVING:
        title = screen.getByText('Extending Lock Period...');
        msg = screen.getByText('Extending your deposit...');
        btnText = screen.getByRole('button', { name: 'Extending...' });
        break;
      case SUCCESS:
        title = screen.getByText('Lock Period Extended!');
        msg = screen.getByText('You have successfully extended your deposit!');
        btnText = screen.getByRole('link', { name: 'Tweet about it' });
        break;
      case ERROR:
        title = screen.getByText('User Denied Transaction');
        msg = screen.getByText('Thank You! Come Again!');
        btnText = screen.getByRole('button', { name: 'Close' });
        break;
    }
    expect(title).toBeInTheDocument();
    expect(line1).toBeInTheDocument();
    expect(line2).toBeInTheDocument();
    expect(line3).toBeInTheDocument();
    expect(line4).toBeInTheDocument();
    expect(btnText).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    expect(days).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(msg).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it('should render the modal for Extend Deposit on locked deposit', () => {
    const extendDays = 1;

    render(
      <ApprovalTranferModal
        approveTransferState={approveTransferState}
        error={error}
        extend={true}
        bounty={bounty}
        depositId={0xf01aecc05f1e304ffaacb3ed1af91d23fd4be565e7b376660efa2916cf657f44}
        depositExpired={depositExpired}
        depositPeriodDays={{ 0xf01aecc05f1e304ffaacb3ed1af91d23fd4be565e7b376660efa2916cf657f44: extendDays }}
        transactionHash={'0xdcc0dd02d34276a66e91254d54c1d91788b0d1d7200e70f27a1959d278f8f2f1'}
      />
    );

    // ASSERT
    let newDate = InitialState.utils.formatDate(currentDate + 1296000 * 1000 + extendDays * 1000 * 60 * 60 * 24);
    let title;
    let line1 = screen.getByText('Deposit:');
    let amount = screen.getByText(/1.0 MATIC/i);
    let line2 = screen.getByText('Extend by:');
    let days = screen.getByText(/1 day/i);
    let line3 = screen.getByText('Locked until:');
    let date = screen.getByText(newDate);
    let line4 = screen.getByText('On address:');
    let address = screen.getByText(/0x3c5 ... e9f/i);
    let btnText;
    let msg;
    switch (approveTransferState) {
      case CONFIRM:
        title = screen.getByText('Extend Lock Period');
        msg = screen.getByText('Are you sure you want to extend this deposit?');
        btnText = screen.getByRole('button', { name: 'Yes, extend!' });
        break;
      case APPROVING:
        title = screen.getByText('Extending Lock Period...');
        msg = screen.getByText('Extending your deposit...');
        btnText = screen.getByRole('button', { name: 'Extending...' });
        break;
      case SUCCESS:
        title = screen.getByText('Lock Period Extended!');
        msg = screen.getByText('You have successfully extended your deposit!');
        btnText = screen.getByRole('link', { name: 'Tweet about it' });
        break;
      case ERROR:
        title = screen.getByText('User Denied Transaction');
        msg = screen.getByText('Thank You! Come Again!');
        btnText = screen.getByRole('button', { name: 'Close' });
        break;
    }
    expect(title).toBeInTheDocument();
    expect(line1).toBeInTheDocument();
    expect(line2).toBeInTheDocument();
    expect(line3).toBeInTheDocument();
    expect(line4).toBeInTheDocument();
    expect(btnText).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    expect(days).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(msg).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
  it('should render the modal for Refund Deposit', () => {
    render(
      <ApprovalTranferModal
        approveTransferState={approveTransferState}
        error={error}
        extend={false}
        bounty={bounty}
        depositId={0xc468cf93bc351051c605130e29dd256ed200bd2d42f598d5dc1cb2b19ddd1743}
        depositExpired={depositExpired}
        depositPeriodDays={{ 0xc468cf93bc351051c605130e29dd256ed200bd2d42f598d5dc1cb2b19ddd1743: 10 }}
        transactionHash={'0xdcc0dd02d34276a66e91254d54c1d91788b0d1d7200e70f27a1959d278f8f2f1'}
      />
    );
    // header display if it exists

    // ASSERT
    let title;
    let line1 = screen.getByText('Deposit:');
    let amount = screen.getByText(/1.0 MATIC/i);
    let line4 = screen.getByText('From address:');
    let address = screen.getByText(/0x3c5 ... e9f/i);
    let btnText;
    let msg;

    switch (approveTransferState) {
      case CONFIRM:
        title = screen.getByText('Refund Deposit');
        msg = screen.getByText(
          'Are you sure you want to refund this deposit? The refund may only be partial if contributors have claimed funds on this contract already.'
        );
        btnText = screen.getByRole('button', { name: 'Yes, refund!' });
        break;
      case APPROVING:
        title = screen.getByText('Refunding Deposit...');
        msg = screen.getByText('Refunding your deposit...');
        btnText = screen.getByRole('button', { name: 'Refunding...' });
        break;
      case SUCCESS:
        title = screen.getByText('Deposit Refunded!');
        msg = screen.getByText(
          'The refund may only be partial if contributors have claimed funds on this contract already.'
        );
        btnText = screen.getByRole('button', { name: 'Close' });
        break;
      case ERROR:
        title = screen.getByText('User Denied Transaction');
        msg = screen.getByText('Thank You! Come Again!');
        btnText = screen.getByRole('button', { name: 'Close' });
        break;
    }
    expect(title).toBeInTheDocument();
    expect(line1).toBeInTheDocument();
    expect(line4).toBeInTheDocument();
    expect(btnText).toBeInTheDocument();
    expect(amount).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(msg).toBeInTheDocument();

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
};
describe('ApprovalTranferModal', () => {
  errors.forEach((error) => approveTransferStates.forEach((state) => test(state, error)));
});
