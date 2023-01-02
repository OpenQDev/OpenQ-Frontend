import React from 'react';
import GithubSignIn from '../../components/Authentication/GithubSignIn';
import renderer from 'react-test-renderer';

describe('GithubSignIn Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<GithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
