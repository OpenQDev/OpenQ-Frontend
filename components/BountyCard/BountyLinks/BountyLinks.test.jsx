/**
 * @vi-environment jsdom
 */
import React from 'react';

import BountyLinks from '../BountyLinks';
import Constants from '../../../test-utils/constant';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('BountyLinks', () => {
  const bounty = Constants.bounty;

  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<BountyLinks bounty={bounty} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
