/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyLinks from '../../components/BountyCard/BountyLinks';
import Constants from '../../test-utils/constant';

describe('BountyLinks', () => {
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
    it('should render Bounty Links', () => {
      // ARRANGE
      render(<BountyLinks bounty={bounty} watchedBounties={[]} />);

      // ASSERT
      const Images = screen.getAllByTestId('link');
      expect(Images).toHaveLength(4);

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  test(bounty);
});
