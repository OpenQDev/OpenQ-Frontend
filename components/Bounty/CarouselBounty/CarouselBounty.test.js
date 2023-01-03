/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import CarouselBounty from '.';
import Constants from '../../../test-utils/constant';

describe('CarouselBounty', () => {
  const bounties = [
    { ...Constants.bounty0, tvc: 9.52 },
    { ...Constants.bounty1, status: '0' },
    { ...Constants.bounty2, tvc: 9.52 },
    { ...Constants.bounty3, tvc: 9.52 },
  ];

  let wasClicked;
  beforeEach(() => {
    wasClicked = jest.fn();
    // eslint-disable-next-line react/display-name
    jest.mock('next/link', () => ({ children }) => <div onClick={wasClicked}>{children}</div>);
  });

  const test = (bounty) => {
    it('should render CarouselBounty', async () => {
      // ARRANGE
      render(<CarouselBounty bounty={bounty} />);

      // ACT
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
          expect(screen.getByText(/tvc/i)).toBeInTheDocument();
          break;
        case Constants.bountyTypeSplit:
          expect(screen.getByText(Constants.splitPrice)).toBeInTheDocument();
          expect(screen.getByText(/tvl/i)).toBeInTheDocument();
          break;
        case Constants.bountyTypeContest:
          expect(screen.getByText(Constants.contestPrice)).toBeInTheDocument();
          break;
        case Constants.bountyTypeFixedContest:
          expect(screen.getByText(Constants.contestPrice)).toBeInTheDocument();
      }
      expect(await screen.findByText(Constants.bountyCost)).toBeInTheDocument();
      const repoName = screen.getByText(/openqdev\/openq-frontend/);
      expect(repoName).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };
  bounties.forEach((bounty) => {
    test(bounty);
  });
});
