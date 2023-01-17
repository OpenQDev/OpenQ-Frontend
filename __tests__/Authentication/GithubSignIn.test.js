import React from 'react';
import GithubSignIn from '../../components/Authentication/GithubSignIn';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

describe('GithubSignIn Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<GithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
