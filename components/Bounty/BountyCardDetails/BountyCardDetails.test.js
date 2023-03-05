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
  const bounty = Constants.bounty0;

  it('should display bubles in correct order', async () => {
    // Arrange
    render(<BountyCardDetails bounty={bounty} />);

    // ASSERT
    //expect(oldBounty.prs).toEqual(bounty.prs);

    await waitFor(() => {
      // gets actions as array
      const actions = screen.getAllByTestId('actionTitle');

      //gets actions individually
      const refundAction = screen.getByText(
        /0xf3\.\.\.2266 refunded a deposit of 2\.0 DERC20 \(\$1\.34\) on September 7, 2022 at 14:08/i
      );
      const fundActionOne = screen.getByText(
        /0xf3\.\.\.2266 funded this contract with 1\.0 MATIC \(\$0\.67\) on September 7, 2022 at 10:09/i
      );
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
      // checks if array of actions is ordered properly
      orderedActions.forEach((action, index) => {
        expect(action).toEqual(actions[index]);
      });
    });
  });
});
