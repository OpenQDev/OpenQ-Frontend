import React from 'react';

import { render, screen } from '../../../test-utils';
import BountyCardDetails from '.';
import Constants from '../../../test-utils/constant';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', () => {
  const bounty = Constants.bounty0;

  it.only('should display bubles in correct order', async () => {
    // Arrange
    render(<BountyCardDetails bounty={bounty} />);

    // ASSERT
    //expect(oldBounty.prs).toEqual(bounty.prs);

    // gets actions as array[
    const allActions = await screen.findAllByTestId('actionTitle');

    //gets actions individually
    const refundAction = await screen.findByText(
      '0xf3...2266 refunded a deposit of 2.0 DERC20 ($1.34) on April 18, 2023 at 2:45.'
    );
    const fundActionOne = await screen.findByText(
      '0xf3...2266 funded this contract with 1.0 MATIC ($0.67) on August 20, 2022 at 14:32. This deposit will expire on September 16, 2022 at 17:11.'
    );
    const fundActionTwo = await screen.findByText(
      '0xf3...2266 funded this contract with 2.0 DERC20 ($1.34) on August 29, 2022 at 15:12. This deposit will expire on August 29, 2022 at 15:12.'
    );
    const fundActionThree = await screen.findByText(
      '0xf3...2266 funded this contract with 1.0 LINK ($0.67) on August 24, 2022 at 1:52. This deposit will expire on August 24, 2022 at 1:52.'
    );
    const mergeAction = await screen.findByText(/FlacoJones merged linked pull request/i);
    const closedAction = await screen.findByText(/FlacoJones closed this issue on March 28, 2022 at 17:57/i);
    const linkedAction = await screen.findByText(/FlacoJones linked/i);
    const mintedAction = await screen.findByText(/0xf3\.\.\.2266 minted this contract on August 29, 2022 at 15:12/i);
    expect(mintedAction).toBeInTheDocument();

    //orders individual actions into a correctly ordered array.
    const orderedActions = [
      refundAction,
      fundActionOne,
      fundActionTwo,
      fundActionThree,
      mergeAction,
      closedAction,
      linkedAction,
      mintedAction,
    ];
    expect(allActions).toHaveLength(orderedActions.length);
    // checks if array of actions is ordered properly
    orderedActions.forEach((action, i) => {
      expect(allActions[i]).toBe(action);
    });
  });
});
