/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../test-utils';
import CarouselBounty from '../../components/Bounty/CarouselBounty';
import Constants from '../../test-utils/constant';

describe('CarouselBounty', () => {
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
    it('should render CarouselBounty', async () => {
      // ARRANGE
      render(<CarouselBounty bounty={bounty} />);

      // ACT
      await waitFor(async () => {
        const repo = await screen.findByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
        expect(repo).toBeInTheDocument();

        // ASSERT
        // can't do entire title, because emojis confuse jest.
        const titleRegex = new RegExp(bounty.title.slice(0, 5), 'i');
        const title = screen.getAllByText(titleRegex);
        expect(title[0]).toBeInTheDocument();

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
  };

  test(bounty);
});
