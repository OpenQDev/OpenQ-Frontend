/**
 * @vi-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import BountyStatus from '../BountyStatus';
import Constants from '../../../test-utils/constant';

describe('BountyStatus', () => {
  const bounties = [
    Constants.bounty,
    { ...Constants.bounty0, status: '0', closed: false },
    { ...Constants.bounty0, assignees: [{}], status: '1' },
    { ...Constants.bounty0, status: '1' },
    { ...Constants.bounty0, status: '0', closed: true },
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
    it('should render Bounty Status', () => {
      // ARRANGE
      render(<BountyStatus bounty={bounty} />);

      // ASSERT
      if (bounty.status === '1') {
        expect(screen.getByText(/Closed/i)).toBeInTheDocument();
      }
      if (bounty.status === '0' && bounty.assignees.length === 0 && !bounty.closed) {
        expect(screen.getByText(Constants.readyForWork)).toBeInTheDocument();
      }
      if (bounty.status === '0' && bounty.assignees.length > 0) {
        expect(screen.getByText(Constants.inProgress)).toBeInTheDocument();
      }
      if (bounty.status === '0' && bounty.closed) {
        expect(screen.getByText(/closed/i)).toBeInTheDocument();
      }
      expect(screen.getByText(/Smart Contract Deployed/i)).toBeInTheDocument();

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  bounties.forEach((bounty) => {
    test(bounty);
  });
});
