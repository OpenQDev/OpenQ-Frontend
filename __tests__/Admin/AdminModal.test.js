/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminModal from '../../components/Admin/AdminModal';
import InitialState from '../../store/Store/InitialState';
import { BigNumber } from 'ethers';

describe('AdminModal', () => {
  const modalBudget = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Budget',
  };

  const modalPayout = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Payout',
  };

  const modalCloseSplitPrice = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'Closed Split Price',
  };

  const modalContest = {
    transaction: {
      to: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000100000000000000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000',
      blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
      transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
      logs: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
        },
      ],
      blockNumber: 92,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x013cde',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x01668feb11',
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 0,
          blockNumber: 92,
          transactionHash: '0x49ef7a99c1bf9790f9de69d8fd8622d668c6e217db150157ca46c11fe652da35',
          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          topics: ['0x9ebf11c1043e634700e1019f0f2f99b428b0fe7e1d5f1d1a5cb3fc74137eb957'],
          data: '0x000000000000000000000000f752c6324fb1b9e776ff6559ce7723b9decbd0490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a688906bd8b00000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 0,
          blockHash: '0xfbd15e811bcee46ef985879debf4bd1495412593b400b6b01760cc4aeded977f',
          args: [
            '0xF752C6324fb1b9e776FF6559CE7723b9DecBD049',
            '0x0000000000000000000000000000000000000000',
            BigNumber.from({ _hex: '0x0de0b6b3a7640000', _isBigNumber: true }),
            {
              type: 'BigNumber',
              hex: '0x03',
            },
            '0x',
            {
              type: 'BigNumber',
              hex: '0x01',
            },
          ],
          event: 'FundingGoalSet',
          eventSignature: 'FundingGoalSet(address,address,uint256,uint256,bytes,uint256)',
        },
      ],
    },
    type: 'PayoutSchedule',
    finalTierVolume: [70, 20, 10],
  };

  beforeEach(() => {
    InitialState.openQClient.reset();
  });

  const test = () => {
    it('should show Budget updated', async () => {
      // ARRANGE
      render(<AdminModal modal={modalBudget} />);

      // ACT
      const heading = screen.getByText('Budget Updated!');
      const subheading = screen.getByText('Budget has been updated. Check out your transaction with the link below:');
      const text = screen.getByText('Budget set to:');
      const amount = screen.getByText(/1.0 MATIC/i);
      const btn = screen.getByRole('button', { name: 'Close' });

      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(btn).toBeInTheDocument();
    });

    it('should show Set Payout Upated for split price contracts', async () => {
      // ARRANGE
      render(<AdminModal modal={modalPayout} />);

      // ACT
      const heading = screen.getByText('Payout Updated!');
      const subheading = screen.getByText('Payout has been updated. Check out your transaction with the link below:');
      const text = screen.getByText('Payout set to:');
      const amount = screen.getByText(/1.0 MATIC/i);
      const btn = screen.getByRole('button', { name: 'Close' });

      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(btn).toBeInTheDocument();
    });

    it('should show Closed contract for split price contracts', async () => {
      // ARRANGE
      render(<AdminModal modal={modalCloseSplitPrice} />);

      // ACT
      const heading = screen.getByText('Split Price Contract Closed!');
      const subheading = screen.getByText(
        'Split Price contract closed, no further claims will be available through this contract. Check out the closing transaction with the link below:'
      );
      const btn = screen.getByRole('button', { name: 'Close' });

      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(btn).toBeInTheDocument();
    });

    it('should show Set New Payout Schedule on Contest contracts', async () => {
      // ARRANGE
      render(<AdminModal modal={modalContest} />);

      // ACT
      const heading = screen.getByText('Payout Schedule Updated!');
      const subheading = screen.getByText(
        'Payout Schedule has been updated. Check out your transaction with the link below:'
      );
      const text = screen.getByText('Payout Schedule set to');
      const btn = screen.getByRole('button', { name: 'Close' });

      // ASSERT
      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(btn).toBeInTheDocument();
    });
  };
  test();
});
