/**
 * @vi-environment jsdom
 */
import React from 'react';
import NavLinks from '.';
import nextRouter from 'next/router';
import renderer from 'react-test-renderer';

describe('NavLinks', () => {
  nextRouter.useRouter = vi.fn();
  nextRouter.useRouter.mockImplementation(() => ({
    query: { type: null },

    prefetch: vi.fn(() => {
      return { catch: vi.fn };
    }),
  }));
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<NavLinks appState={{ accountData: {} }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
