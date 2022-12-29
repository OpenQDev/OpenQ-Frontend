/**
 * @jest-environment jsdom
 */
import React from 'react';
import NavLinks from '../../components/Layout/NavLinks';
import nextRouter from 'next/router';
import renderer from 'react-test-renderer';

describe('NavLinks', () => {
  nextRouter.useRouter = jest.fn();
  nextRouter.useRouter.mockImplementation(() => ({
    query: { type: null },

    prefetch: jest.fn(() => {
      return { catch: jest.fn };
    }),
  }));
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<NavLinks />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
