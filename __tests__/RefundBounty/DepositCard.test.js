/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import DepositCard from '../../components/RefundBounty/DepositCard';
import InitialState from '../../store/Store/InitialState';

describe('DepositCard', () => {
  const deposits = [
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
      receiveTime: '1662395948',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      expiration: '2592000',
      volume: '23000000000000000000',
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
      sender: { id: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', __typename: 'User' },
      __typename: 'Deposit',
    },
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
  ];
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

  const test = (deposit) => {
    it('should render the volume and name of token', async () => {
      // ARRANGE
      render(<DepositCard deposit={deposit} isOnCorrectNetwork={true} />);
      let heading = await screen.findByText(/23.00 MATIC/i);

      // ASSERT
      expect(heading).toBeInTheDocument();
    });

    it('should render refund and extend button when refundable', async () => {
      // ARRANGE
      render(<DepositCard deposit={deposit} status={'refundable'} isOnCorrectNetwork={true} isFunder={true} />);
      const refundBtn = await screen.findByRole('button', { name: /Refund/i });
      const extendBtn = await screen.findByRole('button', { name: /Extend/i });

      // ASSERT
      expect(refundBtn).toBeInTheDocument();
      expect(extendBtn).toBeInTheDocument();

      // ASSERT
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
    it('should render times whether refundable or not', async () => {
      // ARRANGE
      render(<DepositCard deposit={deposit} isOnCorrectNetwork={true} />);

      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      // ASSERT
      expect(nullish).toHaveLength(0);
      if (deposit.refunded) {
        expect(screen.getByText(/Refunded on: September 5, 2022 at 16:44/)).toBeInTheDocument();
      } else {
        expect(screen.getByText(/Refundable on: September 5, 2022 at 16:44/)).toBeInTheDocument();
      }
    });

    it('should render extend button when not refunded yet', async () => {
      // ARRANGE
      render(<DepositCard deposit={deposit} isOnCorrectNetwork={true} isFunder={true} />);
      const extendBtn = await screen.findByRole('button', { name: /Extend/i });

      // ASSERT
      if (deposit.status !== 'refunded') {
        expect(extendBtn).toBeInTheDocument();
      } else {
        expect(extendBtn).toHaveLength(0);
      }

      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });

    /* it('should render change network button when not on right network', async () => {
      // ARRANGE
      render(<DepositCard deposit={deposit} isOnCorrectNetwork={false} />);
      const chgeNetworkBtn = await screen.findByRole('button', { name: /Network/i });

      // ASSERT
      expect(chgeNetworkBtn).toBeInTheDocument();

      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    }); */
  };

  deposits.forEach((deposit) => test(deposit));
});
