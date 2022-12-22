/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Watching from '../../../components/User/WatchingTab/Watching';
import userEvent from '@testing-library/user-event';
import Constants from '../../../test-utils/constant';

describe('Watching', () => {
  const bounties = Constants.bounties;

  beforeEach(() => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe,
      disconnect,
    }));
  });
  it('should render Watching', async () => {
    // ARRANGE
    render(<Watching watchedBounties={bounties} complete={true} />);

    // ASSERT
    bounties.forEach(async (bounty) => {
      const orgName = await screen.findByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
      // ACT
      expect(orgName).toBeInTheDocument();
    });
  });

  it('should let user open BountyCardDetailsModal', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Watching watchedBounties={bounties} complete={true} />);

    // ASSERT

    bounties.forEach(async (bounty) => {
      const orgName = await screen.findByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
      await user.click(orgName);
      if (bounty.status == 1) {
        const bountyStatus = await screen.findAllByText(/Closed/i);
        expect(bountyStatus[0]).toBeInTheDocument();
      }
      const link = await screen.findAllByText(/Full Contract/i);
      expect(link[0]).toBeInTheDocument();
    });
    // should not have null or undefined values
    const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
    expect(nullish).toHaveLength(0);
  });
});
