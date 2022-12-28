import React from 'react';
import BountyContributors from '../../components/Bounty/BountyContributors';
import renderer from 'react-test-renderer';

describe('BountyContributors Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<BountyContributors />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
