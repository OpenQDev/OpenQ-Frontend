/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../test-utils';
import CarouselBounty from '../../components/Bounty/CarouselBounty';
import Constants from '../../test-utils/constant';

describe('CarouselBounty', () => {
  const bounties = Constants.bounties;
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
        switch (bounty.bountyType) {
          case Constants.bountyTypeFixed:
            expect(screen.getByText(Constants.fixedPrice)).toBeInTheDocument();
            break;
          case Constants.bountyTypeSplit:
            expect(screen.getByText(Constants.splitPrice)).toBeInTheDocument();
            break;
          case Constants.bountyTypeContest:
            expect(screen.getByText(Constants.contestPrice)).toBeInTheDocument();
            break;
          case Constants.bountyTypeFixedContest:
            expect(screen.getByText(Constants.contestPrice)).toBeInTheDocument();
        }

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
