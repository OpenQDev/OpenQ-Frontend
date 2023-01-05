/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import SetPayoutAdminPage from '.';
import InitialState from '../../../store/Store/InitialState';
import Constants from '../../../test-utils/constant';
import userEvent from '@testing-library/user-event';
import MockOpenQClient from '../../../services/ethers/MockOpenQClient';
import TokenProvider from '../../TokenSelection/TokenStore/TokenProvider';

describe('SetPayoutAdminPage', () => {
  // set payout is only for Split Price bounties (of type 1)
  const splitBounty = Constants.bounty1;
  const refreshBounty = () => {
    return null;
  };

  beforeEach(() => {
    InitialState.openQClient.reset();
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });
  it('should allow user to update payout token and volume when no deposits', async () => {
    // ARRANGE
    const noDepositSplitBounty = { ...splitBounty, deposits: [] };
    const user = userEvent.setup();
    const setPayout = jest.fn();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ setPayout }),
    };
    const { asFragment } = render(
      <SetPayoutAdminPage refreshBounty={() => {}} bounty={noDepositSplitBounty} />,
      {},
      customInitialState
    );
    expect(asFragment()).toMatchSnapshot('Snapshot: initial view');

    // ACT
    await user.type(screen.getByRole('textbox'), '100');
    await user.click(screen.getByRole('button', { name: 'select token' }));
    await user.click(screen.getByRole('button', { name: /link/i }));
    await user.click(await screen.findByRole('button', { name: 'Set Payout' }));

    // ASSERT
    expect(await screen.findByText(/Updating Payout.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    const updatedTexts = await screen.findAllByText(/updated/i);
    expect(updatedTexts[0]).toBeInTheDocument();
    expect(await screen.findByText(/100.0 LINK/i)).toBeInTheDocument();
    expect(setPayout).toBeCalledWith(
      noDepositSplitBounty.bountyId,
      '100',
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    );
  });
  it('should lock token to deposit-token but allow volume update when deposits', async () => {
    const otherTokenDepositSplitBounty = { ...splitBounty, deposits: [Constants.deposit2] };
    // ARRANGE
    const user = userEvent.setup();
    const setPayout = jest.fn();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ setPayout }),
    };
    render(
      <TokenProvider>
        <SetPayoutAdminPage refreshBounty={refreshBounty} bounty={otherTokenDepositSplitBounty} />
      </TokenProvider>,
      {},
      customInitialState
    );

    // ACT
    await user.type(screen.getByRole('textbox'), '100');
    const selectToken = screen.getByRole('button', { name: 'select token' });
    expect(selectToken).toBeDisabled(true);
    expect(selectToken).toMatchSnapshot('Snapshot: button style changes to not appear as button');
    await user.click(await screen.findByRole('button', { name: 'Set Payout' }));

    // ASSERT
    expect(await screen.findByText(/Updating Payout.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    const updatedTexts = await screen.findAllByText(/updated/i);
    expect(updatedTexts[0]).toBeInTheDocument();
    expect(await screen.findByText(/100.0 DERC20/i)).toBeInTheDocument();
    expect(setPayout).toBeCalledWith(
      otherTokenDepositSplitBounty.bountyId,
      '100',
      otherTokenDepositSplitBounty.deposits[0].tokenAddress
    );
  });
  it('should allow user to close contract', async () => {
    // ARRANGE
    const closeOngoing = jest.fn();
    const user = userEvent.setup();
    const customInitialState = {
      ...InitialState,
      openQClient: new MockOpenQClient({ closeOngoing }),
    };
    render(
      <SetPayoutAdminPage setShowButton={() => null} refreshBounty={() => {}} bounty={splitBounty} />,
      {},
      customInitialState
    );

    // ACT
    await user.click(screen.getByRole('button', { name: /Close Split/ }));
    expect(await screen.findByText(/Closing Split Price Contract.../)).toBeInTheDocument();
    expect(screen.getByText(/our request is being processed.../)).toBeInTheDocument();
    expect(await screen.findByText(/Split Price contract closed,/)).toBeInTheDocument();

    // ASSERT
    expect(closeOngoing).toBeCalledWith(splitBounty.bountyId);
  });
});
