/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import BountyCardDetails from '.';
import { waitFor } from '@testing-library/react';
import Constants from '../../../test-utils/constant';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', () => {
  const tokenValues = {
    tokenPrices: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 0.67 },
    tokens: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 8.040000000000001 },
    total: 8.04,
  };
  // bounty type 1 (split price) only have one type of deposits possible
  const bounties = [Constants.bounty0, Constants.bounty2, Constants.bounty3];
  const test = (bounty) => {
    it('should display bubles in correct order', async () => {
      // Arrange
      render(
        <BountyCardDetails
          bounty={bounty}
          address={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
          tokenValues={tokenValues}
        />
      );

      // ASSERT
      //expect(oldBounty.prs).toEqual(bounty.prs);

      await waitFor(() => {
        // gets actions as array
        const actions = screen.getAllByTestId('actionTitle');

        //gets actions individually
        const refundAction = screen.getByText(
          /0xf3\.\.\.2266 refunded a deposit of 2\.0 DERC20 \(\$1\.34\) on September 7, 2022 at 14:08/i
        );/*
        const fundActionOne = screen.getByText(
          /0xf3\.\.\.2266 funded this contract with 1\.0 MATIC \(\$0\.67\) on September 7, 2022 at 10:09/i
        );*/
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
      /*    fundActionOne,*/
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
  };
  bounties.forEach((bounty) => {
    test(bounty);
  });
});
