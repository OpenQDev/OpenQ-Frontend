import React from 'react';
import LogIn from '../../components/Authentication/LogIn';
import renderer from 'react-test-renderer';

describe('Login Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LogIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
