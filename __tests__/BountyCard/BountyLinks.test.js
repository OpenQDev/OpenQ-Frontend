/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyLinks from '../../components/BountyCard/BountyLinks';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';

describe('BountyLinks', () => {
  const newBounties = mocks.bounties;
  const issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
  const prismaContracts = mocks.prismaBounties;
  const fullBounties = InitialState.utils.combineBounties(
    newBounties,
    issueData,
    prismaContracts.bounties.bountyConnection.nodes
  );

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
      const Images = screen.getAllByRole('link');
      expect(Images).toHaveLength(4);

      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    });
  };

  fullBounties.forEach((bounty) => test({ ...bounty, watchingUsers: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' }));
});
