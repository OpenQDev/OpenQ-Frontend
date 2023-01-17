import React from 'react';
import LoadingThread from '../../components/Loading/LoadingThread';
import renderer from 'react-test-renderer';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

describe('LoadingThread', () => {
  it('should match DOM Snapshot', () => {
    const tree = renderer.create(<LoadingThread changeText={false} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
