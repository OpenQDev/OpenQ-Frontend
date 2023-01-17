import React from 'react';
import LoginPageGithubSignIn from '../../components/Authentication/LoginPageGithubSignIn';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

describe('LoginPageGithubSignIn', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoginPageGithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
