/**
 * @vi-environment jsdom
 */
import React from 'react';
import GithubAuth from '../../../pages/auth/github';

import { render } from '../../../test-utils';
import nextRouter from 'next/router';

describe('GithubAuth', () => {
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));

    nextRouter.useRouter = vi.fn();

    nextRouter.useRouter.mockImplementation(() => ({
      query: { type: null },
      prefetch: vi.fn(() => {
        return { catch: vi.fn };
      }),
    }));
  });

  it('should allow user to open BountyCardDetailsModal', async () => {
    render(<GithubAuth />);
  });
});
