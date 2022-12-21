/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../test-utils';
import BountyHeading from '../../components/Bounty/BountyHeading';
import Constants from '../../test-utils/constant';

describe('BountyHeading', () => {
  const bounty = Constants.bounty;
  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });

  const test = (bounty, price) => {
    it('should render Bounty heading', async () => {
      // ARRANGE
      render(<BountyHeading bounty={bounty} price={price} />);

      // ASSERT
      await waitFor(async () => {
        const title = screen.getByText(/Properly Referenced and Merged by FlacoJones/i);
        expect(title).toBeInTheDocument();

        const mintBountyButton = screen.getByText(/Contract/);
        expect(mintBountyButton).toBeInTheDocument();

        const status = await screen.findAllByText(/open||closed/);
        expect(status[0]).toBeInTheDocument();

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };

  test(bounty);
});
