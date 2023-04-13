import React from 'react';
import GithubSignIn from '.';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

nextRouter.useRouter = vi.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: vi.fn(() => {
    return { catch: vi.fn };
  }),
}));

describe('GithubSignIn Snapshot', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<GithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
