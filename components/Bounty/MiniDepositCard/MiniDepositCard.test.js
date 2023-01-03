/**
 * @jest-environment jsdom
 */
import React from 'react';

import MiniDepositCard from '.';
import Constants from '../../../test-utils/constant';
import { render, screen } from '../../../test-utils';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('MiniDepositCard', () => {
  const bounty = Constants.bounty;
  const deposit = Constants.deposit1;

  it('should render at least one label', async () => {
    // ARRANGE
    render(<MiniDepositCard deposit={deposit} />);
    if (bounty.labels[0]) {
      // ASSERT
      expect(await screen.findByText(/\$0\.67/i));
      expect(await screen.findByText(/1\.00 MATIC/));
    }

    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
