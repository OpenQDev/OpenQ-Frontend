import React from 'react';
import LoginPageGithubSignIn from '../../components/Authentication/LoginPageGithubSignIn';
import renderer from 'react-test-renderer';

describe('LoginPageGithubSignIn', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoginPageGithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
