/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../../test-utils';
import BountyHeading from '.';
import Constants from '../../../test-utils/constant';
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

  const test = (bounty, position) => {
    it('should render Bounty heading', async () => {
      // ARRANGE
      render(<BountyHeading bounty={bounty} />, {}, {}, Constants.authState);

      await waitFor(async () => {
        // ASSERT
        const title = screen.getByText(/Properly Referenced and Merged by FlacoJones/i);
        expect(title).toBeInTheDocument();

        const mintBountyButton = screen.getByText(/Contract/);
        expect(mintBountyButton).toBeInTheDocument();
        const refreshButton = screen.getByText(/Refresh/);
        expect(refreshButton).toBeInTheDocument();

        switch (position) {
          case 0:
            expect(await screen.findByText(Constants.readyForWork)).toBeInTheDocument();
            break;
          case 1:
            expect(await screen.findByText(Constants.inProgress)).toBeInTheDocument();
            break;
          case 2:
            expect(await screen.findByText(Constants.claimAvailable)).toBeInTheDocument();
            break;
          default:
            expect(await screen.findByText(Constants.contestPrice)).toBeInTheDocument();
        }

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
