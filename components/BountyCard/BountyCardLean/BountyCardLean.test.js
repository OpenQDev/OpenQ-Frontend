/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import BountyCardLean from '../BountyCardLean';
import userEvent from '@testing-library/user-event';
import Constants from '../../../test-utils/constant';

describe('BountyCard', () => {
  const bounties = [...Constants.bounties, { ...Constants.bounty0, status: '0' }];

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });
  const test = (bounty) => {
    it('should render BountyCard', async () => {
      // ARRANGE
      render(<BountyCardLean item={bounty} complete={true} />);

      // ASSERT
      await waitFor(async () => {
        const orgName = await screen.findByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
        // ACT
        expect(orgName).toBeInTheDocument();
      });
    });

    it('should let user open BountyCardDetailsModal', async () => {
      // ARRANGE
      const user = userEvent.setup();
      render(<BountyCardLean item={bounty} complete={true} />);

      // ASSERT
      await waitFor(async () => {
        const orgName = await screen.findByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
        await user.click(orgName);
        if (bounty.status == 1) {
          const bountyStatus = await screen.findAllByText(/Closed/i);
          expect(bountyStatus[0]).toBeInTheDocument();
        }
        const link = await screen.findAllByText(/Full Contract/i);
        expect(link[0]).toBeInTheDocument();
        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };
  bounties.forEach((bounty) => {
    test(bounty);
  });
});
