import React from 'react';

import BountyHomepage from '.';
import Constants from '../../../test-utils/constant';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('BountyHomepage', () => {
  const bounty = Constants.bounty;
  const categories = ['fixed price', 'split-price', 'contest'];

  it('should render UnexpectedErrorModal and match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<BountyHomepage bounty={bounty} address={bounty.bountyAddress} error={true} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  const test = (category) => {
    it('should render BountyDetails and match DOM Snapshot', () => {
      const shallow = new ShallowRenderer();
      shallow.render(<BountyHomepage bounty={bounty} address={bounty.bountyAddress} category={category} />);
      const tree = shallow.getRenderOutput();
      expect(tree).toMatchSnapshot(category);
    });
  };

  categories.forEach((category) => test(category));
});
