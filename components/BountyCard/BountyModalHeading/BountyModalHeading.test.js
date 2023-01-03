import React from 'react';
import BountyModalHeading from '../BountyModalHeading';
import ShallowRenderer from 'react-test-renderer/shallow';
import Constants from '../../../test-utils/constant';

describe('BountyModalHeading Snapshot', () => {
  const bounty = Constants.bounty;
  it('should match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<BountyModalHeading bounty={bounty} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});
