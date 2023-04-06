import { render } from '../../../test-utils';
import React from 'react';
import RequestPage from '.';
import nextRouter from 'next/router';

nextRouter.useRouter = vi.fn();
nextRouter.useRouter.mockImplementation(() => ({
  query: { type: null },

  prefetch: vi.fn(() => {
    return { catch: vi.fn };
  }),
}));

describe('RequestPage', () => {
  it('should match initial DOM Snapshot', () => {
    const { asFragment } = render(<RequestPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
