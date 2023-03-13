import { render } from '../../../test-utils';
import React from 'react';
import RequestPage from '.';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: jest.fn(() => {
    return { catch: jest.fn };
  }),
}));

describe('RequestPage', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<RequestPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
