import React from 'react';
import LoadingThread from '../../components/Loading/LoadingThread';
import renderer from 'react-test-renderer';

describe('LoadingThread', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoadingThread changeText={false} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
