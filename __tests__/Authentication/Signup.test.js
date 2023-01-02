import React from 'react';
import Signup from '../../components/Authentication/Signup';
import renderer from 'react-test-renderer';

describe('Signup Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<Signup />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
