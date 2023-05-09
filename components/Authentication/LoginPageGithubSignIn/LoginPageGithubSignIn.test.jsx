import React from 'react';
import LoginPageGithubSignIn from '.';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

nextRouter.useRouter = vi.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: vi.fn(() => {
    return { catch: vi.fn };
  }),
}));

describe('LoginPageGithubSignIn', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoginPageGithubSignIn />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
