/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../../test-utils';
import DepositList from '../../../../components/User/OverviewTab/DepositList';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../../../test-utils/constant';

describe('DepositList', () => {
  const deposits = Constants.deposits;

  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<DepositList deposits={deposits} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  it('should render Bounty heading', async () => {
    // ARRANGE
    render(<DepositList deposits={deposits} />);

    // ASSERT
    expect(screen.getAllByText(/Deposited on: September 7, 2022 at 10:09/)).toHaveLength(3);
    expect(screen.getAllByText(/Refundable on: September 22, 2022 at 10:09/)).toHaveLength(2);
    expect(screen.getByText(/Refunded on: September 7, 2022 at 14:08/)).toBeInTheDocument();
  });
});
