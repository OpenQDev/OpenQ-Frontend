/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import BountyCardDetailsModal from '../BountyCardDetailsModal';
import Constants from '../../../test-utils/constant';

describe('BountyCardDetailsModal', () => {
  const bounties = [...Constants.bounties, { ...Constants.bounty0, status: '0' }];

  beforeEach(() => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = vi.fn(() => ({
      observe,
      disconnect,
    }));
  });
  const test = (bounty) => {
    it('should display BountyCardDetailsModal', async () => {
      // ARRANGE
      render(<BountyCardDetailsModal bounty={bounty} closeModal={() => null} showModal={true} complete={true} />);
      await waitFor(async () => {
        // ASSERT
        const orgName = screen.getByText(bounty.owner);
        expect(orgName).toBeInTheDocument();

        const bountyAddressRegExp = new RegExp(bounty.bountyAddress.slice(0, 4));
        expect(screen.getByText(bountyAddressRegExp)).toBeInTheDocument();
        expect(screen.getByText('Watch')).toBeInTheDocument();
        if (bounty.labels[0]) {
          expect(screen.getByText(bounty.labels[0].name)).toBeInTheDocument();
        }
        expect(screen.getByText(/Deposits/i)).toBeInTheDocument();
        const link = await screen.findAllByText(/Full Contract/i);
        expect(link[0]).toBeInTheDocument();
        expect(screen.getByText(/Smart Contract/)).toBeInTheDocument();

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
