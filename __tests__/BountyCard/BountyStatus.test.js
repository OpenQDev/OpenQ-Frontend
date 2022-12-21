/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyStatus from '../../components/BountyCard/BountyStatus';
import Constants from '../../test-utils/constant';

describe('BountyStatus', () => {
  const bounty = Constants.bounty;
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
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
      if (bounty.status === '0') {
        expect(screen.getByText(/Open/i)).toBeInTheDocument();
      }
      expect(screen.getByText(/Smart Contract Deployed/i)).toBeInTheDocument();

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test(bounty);
});
