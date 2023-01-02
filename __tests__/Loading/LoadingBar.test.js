import React from 'react';
import LoadingBar from '../../components/Loading/LoadingBar';
import renderer from 'react-test-renderer';

describe('LoadingBar', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoadingBar changeText={false} />);
    expect(tree.toJSON()).toMatchSnapshot('and say "It will take..." ');
  });
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoadingBar changeText={true} />);
    expect(tree.toJSON()).toMatchSnapshot('and say "Please reload..." ');
  });
});
