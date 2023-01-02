import React from 'react';
import TokenStats from '../../components/FundBounty/TokenStats';
import renderer from 'react-test-renderer';
import Constants from '../../test-utils/constant';

describe('TokenStats', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<TokenStats volume={'2.8'} token={Constants.tokenMetadata} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
