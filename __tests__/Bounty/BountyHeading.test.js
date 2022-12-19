/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../test-utils';
import BountyHeading from '../../components/Bounty/BountyHeading';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';

describe('BountyHeading', () => {
  const newBounties = mocks.bounties;
  const issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
  const prismaContracts = mocks.prismaBounties;
  const fullBounties = InitialState.utils.combineBounties(newBounties, issueData, prismaContracts.bounties.nodes);

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
        const title = screen.getByText(/No way to disable HMR/i);
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

  test(fullBounties[0], 19);
});
