/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../../../test-utils';
import Constants from '../../../../test-utils/constant';
import RefreshBounty from '.';
//
describe('BountyHeading', () => {
  const bounties = [
    { ...Constants.bounty0, closed: false },
    { ...Constants.bounty0, closed: false, assignees: [{}] },
    {
      ...Constants.bounty0,
      status: '0',
      closed: false,
      prs: [{ source: { author: Constants.authState, merged: true } }],
    },
  ];
  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });

  const test = (bounty) => {
    it('should render Bounty heading', async () => {
      // ARRANGE
      await waitFor(async () => {
        render(<RefreshBounty bounty={bounty} />, {}, {}, Constants.authState);

        const refreshButton = screen.getByText(/Refresh/);
        expect(refreshButton).toBeInTheDocument();

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };
  bounties.forEach((bounty, position) => {
    test(bounty, position);
  });
});
