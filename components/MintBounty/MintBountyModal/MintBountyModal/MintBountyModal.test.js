/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
import InitialState from '../../../../store/Store/InitialState';
import MintBountyModal from '.';
import MintContext from '../../MintContext';
import InitialMintState from '../../InitialMintState';

import { waitFor } from '@testing-library/react';

const issues = [
  { status: 'not-issue', url: 'asdfsadf' },
  {
    status: 'mintable',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21',
  },
  {
    status: 'minted',
    url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221',
  },
  {
    status: 'unknown',
    url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/2190',
  },
];

const types = [['0'], ['1'], ['2'], ['3']];
const zeroAddressMetadata = {
  address: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  name: 'Matic',
  symbol: 'MATIC',
  chainId: 80001,
  path: '/crypto-logos/MATIC.svg',
};
InitialState.openQClient.shouldSleep = 200;
const test = (issue, type) => {
  it(`should handle mint interactions for type ${type[0]}`, async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mintState = {
      ...InitialMintState,
      enableMint: false,
      isLoading: false,
      finalTierVolumes: [10, 20, 70],
      issue: issue,
      goalToken: zeroAddressMetadata,
      goalVolume: '',
      registrationDeadline: new Date(),
      startDate: new Date(),
      enableRegistration: true,
      category: 'Contest',
      payoutVolume: 100,
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = jest.fn();

    nextRouter.useRouter = jest.fn();
    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },

      prefetch: jest.fn(() => {
        return { catch: jest.fn };
      }),
    }));

    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <MintBountyModal types={type} />
      </MintContext.Provider>
    );
    // ACT
    const inputs = await screen.findAllByRole('textbox');
    await user.type(inputs[0], issues[0].url);
    await user.clear(inputs[0]);
    await user.type(inputs[0], issue.url);

    await waitFor(async () => {
      const deploy = await screen.findAllByText(/deploy/i);
      expect(deploy[0]).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  });

  it(`should contain link to .sol code`, async () => {
    // ARRANGE
    const mintState = {
      ...InitialMintState,
      enableMint: false,
      isLoading: false,
      finalTierVolumes: [10, 20, 70],
      issue: issue,
      goalToken: zeroAddressMetadata,
      goalVolume: '',
      registrationDeadline: new Date(),
      startDate: new Date(),
      enableRegistration: true,
      category: 'Contest',
      payoutVolume: 100,
      payoutToken: zeroAddressMetadata,
    };
    const mintDispatch = jest.fn();

    render(
      <MintContext.Provider value={[mintState, mintDispatch]}>
        <MintBountyModal types={type} />
      </MintContext.Provider>
    );
    //ASSERT
    await waitFor(() => {
      expect(screen.getAllByRole('link')[0].href).toEqual('https://kycdao.xyz/home');
      expect(screen.getAllByRole('link')[1].href).toEqual('http://localhost/terms-of-use');
      expect(screen.getAllByRole('link')[2].href).toEqual(
        'https://github.com/OpenQDev/OpenQ-Contracts/tree/production/contracts/Bounty/Implementations'
      );
    });
  });

  if (type[0] !== '3') {
    it(`should handle extra data for type ${type[0]}`, async () => {
      // ARRANGE
      const user = userEvent.setup();
      const mintState = {
        ...InitialMintState,
        enableMint: false,
        isLoading: false,
        finalTierVolumes: [10, 20, 70],
        issue: issue,
        goalToken: zeroAddressMetadata,
        goalVolume: '123',
        registrationDeadline: new Date(),
        startDate: new Date(),
        enableRegistration: true,
        category: 'Contest',
        payoutVolume: '123',
        payoutToken: zeroAddressMetadata,
      };
      const mintDispatch = jest.fn();

      render(
        <MintContext.Provider value={[mintState, mintDispatch]}>
          <MintBountyModal types={type} />
        </MintContext.Provider>
      );
      // ACT
      const inputs = await screen.findAllByRole('textbox');
      await user.type(inputs[0], issue.url);
      await user.click(screen.getAllByRole('checkbox')[0]);
      await user.type(screen.getByLabelText('budget'), '123assdf');

      const deploy = screen.getAllByText(/deploy/i);
      expect(deploy[0]).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  }
};
describe('MintBountyModal', () => {
  issues.forEach((issue) => {
    types.forEach((type) => test(issue, type));
  });
});
