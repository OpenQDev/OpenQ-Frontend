/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import FundPage from '.';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../store/Store/InitialState';
import FundContext from '../../FundBounty/FundStore/FundContext';
import FundProvider from '../../FundBounty/FundStore/FundProvider';
import Constants from '../../../test-utils/constant';
import InitialFundState from '../../FundBounty/FundStore/InitialFundState';
import { CONFIRM } from '../../FundBounty/FundStore/ApproveFundState';

describe('FundPage', () => {
  const bounty = Constants.bounty;
  const splitBounty = Constants.bounty1;

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

  describe('Split Price Bounties', () => {
    it('should lock token choice to deposit token when there is 1+ deposit', async () => {
      // ARRANGE
      const otherTokenDepositSplitBounty = { ...splitBounty, deposits: [Constants.deposit3] };
      const user = userEvent.setup();
      const { asFragment } = render(
        <FundProvider bounty={otherTokenDepositSplitBounty} refreshBounty={refreshBounty}>
          <FundPage bounty={otherTokenDepositSplitBounty} />
        </FundProvider>
      ); // ACT / ASSERT
      expect(asFragment()).toMatchSnapshot();

      const input = screen.getByLabelText('amount');
      await user.type(input, '0.30sdf');
      expect(screen.getAllByText(/link/i)[0]).toBeInTheDocument;
      const selectToken = screen.getByRole('button', { name: 'select token' });
      expect(selectToken).toBeDisabled();
      expect(selectToken).toMatchSnapshot('Snapshot: button style changes to not appear as button');
      const button = screen.getByRole('button', { name: /Fund/i });
      await user.click(button);
    });
  });

  describe('Fixed Bounties', () => {
    it('should render the heading', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );

      // ACT
      const heading = screen.getByText('Fund');
      expect(heading).toBeInTheDocument();
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
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should render list items', async () => {
      const user = userEvent.setup();
      // ARRANGE
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
      const input = screen.getByLabelText('amount');
      await user.type(input, '200');

      // ACT
      const token = screen.getByText('MATIC');
      const button = screen.getByRole('button', { name: /Fund/i });
      await user.click(button);
      const confirmBtn = await screen.findAllByRole('button', { name: /Fund/i });
      expect(confirmBtn[0]).toBeInTheDocument();
      await user.click(confirmBtn[1]);
      const modalContent = await screen.findByText(/Too Low/i);

      // ASSERT
      expect(modalContent).toBeInTheDocument();

      // ASSERT
      expect(token).toBeInTheDocument();
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should let user submit and handle too low amount of token', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
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
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should let user submit and handle owned amount of Matic', async () => {
      // ARRANGE
      const user = userEvent.setup();
      const state = {
        ...InitialFundState,
        bounty,
        refreshBounty,
        token: Constants.tokenMetadata,
        volume: '3',
        approveTransferState: CONFIRM,
      };
      const dispatch = jest.fn();
      render(
        <FundContext.Provider value={[state, dispatch]}>
          <FundPage bounty={bounty} />
        </FundContext.Provider>
      );
      // ACT
      const value = await screen.findByText(/3 Dai/i);

      // ASSERT
      expect(value).toBeInTheDocument();
      const confirmBtn = await screen.findAllByRole('button', { name: /Fund/i });
      await user.click(confirmBtn[1]);
      expect(dispatch).toHaveBeenCalledWith({ type: 'SET_APPROVE_TRANSFER_STATE', payload: 'APPROVE' });
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should let user submit and handle owned amount of Link', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      ); // ACT
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
        timeout: 8000,
      });
      const tweet = screen.getByText('Tweet about it');
      expect(tweet).toBeInTheDocument();
      await user.click(screen.getByTestId('cross'));
      expect(modalContent).not.toBeInTheDocument();
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should go straight to fund when DERC20 approved previously', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
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
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should handle approval errors', async () => {
      // ARRANGE
      InitialState.openQClient.shouldError = true;
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
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
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should prevent user from submitting over 10000000', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
      // ACT
      const input = screen.getByLabelText('amount');
      await user.type(input, '10000000');
      const button = await screen.findByRole('button', { name: /Fund/i });

      // ASSERT
      expect(button).toBeDisabled();
      await user.hover(button);
      const tooltip = await screen.findByText(/Must be between/);
      expect(tooltip).toBeInTheDocument();
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should prevent user from submitting under 0.00000001', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      );
      // ACT
      const input = screen.getByLabelText('amount');
      await user.type(input, '0.00000001');
      const button = await screen.findByRole('button', { name: /Fund/i });

      // ASSERT
      expect(button).toBeDisabled();
      await user.hover(button);
      const tooltip = await screen.findByText(/Must be between/);
      expect(tooltip).toBeInTheDocument();
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    it('should show tooltip', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(
        <FundProvider bounty={bounty} refreshBounty={refreshBounty}>
          <FundPage bounty={bounty} />
        </FundProvider>
      ); // ACT / ASSERT
      const button = screen.getByRole('button', { name: /Fund/i });
      expect(button).toBeDisabled();
      await user.hover(button);
      const tooltip = await screen.findByText(/indicate the volume you'd like to fund with./i);
      expect(tooltip).toBeInTheDocument();
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });
});
