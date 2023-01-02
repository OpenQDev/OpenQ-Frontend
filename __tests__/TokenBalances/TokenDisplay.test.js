import React from 'react';
import TokenDisplay from '../../components/TokenBalances/TokenDisplay';
import renderer from 'react-test-renderer';
import Constants from '../../test-utils/constant';

const token = Constants.tokenMetadata;

describe('TokenDisplay', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<TokenDisplay token={token} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
