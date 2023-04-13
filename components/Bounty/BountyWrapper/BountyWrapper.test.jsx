/**
 * @vi-environment jsdom
 */
import React from 'react';

import BountyWrapper from '.';
import Constants from '../../../test-utils/constant';
import ShallowRenderer from 'react-test-renderer/shallow';

// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyWrapper', () => {
  const tokenValues = {
    tokenPrices: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 0.67 },
    tokens: { '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39': 8.040000000000001 },
    total: 8.04,
  };

  const bounty = Constants.bounty;

  it('should render BountyDetails and match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(
      <BountyWrapper bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues}>
        <div></div>
      </BountyWrapper>
    );
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
