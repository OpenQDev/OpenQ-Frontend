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
      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          <div
            class="flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center"
          >
            <div
              class="flex flex-col w-full space-y-5 pb-8 items-center md:border rounded-sm border-gray-700"
            >
              <div
                class="flex text-3xl w-full text-primary justify-center px-16 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm"
              >
                Escrow Funds in Split Price Contract
              </div>
              <div
                class="flex flex-col space-y-5 w-5/6 pt-2"
              >
                <div
                  class="flex w-full gap-4"
                >
                  <div
                    class="flex space-x-4 w-full undefined"
                  >
                    <div
                      class="flex w-full flex-row justify-between items-center px-4 input-field-big"
                    >
                      <div
                        class=" bg-dark-mode"
                      >
                        <input
                          aria-label="amount"
                          autocomplete="off"
                          class="font-semibold number outline-none bg-input-bg text-primary w-full"
                          id="amount"
                          placeholder="0.0"
                          value=""
                        />
                      </div>
                    </div>
                    <div
                      class="flex"
                    >
                      <button
                        aria-label="select token"
                        class="flex flex-row items-center p-0.5 px-2 cursor-default"
                        disabled=""
                      >
                         
                        <div
                          class="flex h-4 w-4 items-center justify-center"
                        >
                          <img
                            alt="selected token"
                            class="rounded-full"
                            data-nimg="1"
                            decoding="async"
                            height="40"
                            loading="lazy"
                            src="https://wallet-asset.matic.network/img/tokens/link.svg"
                            srcset="https://wallet-asset.matic.network/img/tokens/link.svg 1x, https://wallet-asset.matic.network/img/tokens/link.svg 2x"
                            style="color: transparent;"
                            width="40"
                          />
                        </div>
                        <div
                          class="flex pl-2 pr-1 text-primary"
                        >
                          LINK
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="flex gap-4"
                >
                  <div
                    class="w-full"
                  >
                    <div
                      class="flex w-full input-field-big mb-4"
                    >
                      <div
                        class=" flex items-center gap-3 w-full text-primary md:whitespace-nowrap"
                      >
                        <div
                          class="group "
                        >
                          <div
                            class="cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary"
                          >
                            ?
                          </div>
                          <div
                            class="justify-center w-full relative hidden z-50 group-hover:block  -top-1 "
                          >
                            <div
                              class="flex flex-col items-center"
                            >
                              <div
                                class="flex mt-0.5 md:mt-1 tooltip-triangle absolute undefined"
                              />
                              <div
                                class="flex tooltip absolute md:-left-12"
                              >
                                <div
                                  class="whitespace-normal md:w-96 sm:w-60 w-40  "
                                >
                                  This is the number of days that your deposit will be in escrow. After this many days, your deposit will be fully refundable if the contract has still not been claimed.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span>
                          Deposit Locked Period
                        </span>
                      </div>
                      <div
                        class="flex px-4 font-bold bg-input-bg"
                      >
                        <input
                          autocomplete="off"
                          class="text-primary text-right number outline-none w-full flex-1 bg-input-bg"
                          id="deposit-period"
                          value="30"
                        />
                      </div>
                    </div>
                    <div
                      class="flex items-center"
                    />
                    <div
                      class="group w-min"
                    >
                      <button
                        class="text-center px-8 w-min items-center py-0.5  btn-default w-full cursor-not-allowed py-1.5"
                        disabled=""
                        type="button"
                      >
                        <div
                          class="text-center whitespace-nowrap w-full"
                        >
                          Fund
                        </div>
                      </button>
                      <div
                        class="justify-center w-full relative hidden z-50 group-hover:block  -top-1  "
                      >
                        <div
                          class="flex flex-col items-center"
                        >
                          <div
                            class="flex mt-0.5 md:mt-1 tooltip-triangle absolute undefined"
                          />
                          <div
                            class="flex tooltip absolute left-0"
                          >
                            <div
                              class="sm:w-40 md:w-60 whitespace-normal"
                            >
                              Please indicate the volume you'd like to fund with. Must be between 0.0000001 and 1,000,000.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DocumentFragment>
      `);

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
