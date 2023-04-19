import React from 'react';
import ErrorModal from '.';
import renderer from 'react-test-renderer';

describe('ErrorModal', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<ErrorModal error={{ title: 'Error', message: 'My error message' }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
