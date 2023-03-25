/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils';
import Watching from '../../../components/User/WatchingTab/Watching';
import userEvent from '@testing-library/user-event';
import Constants from '../../../test-utils/constant';
import ShallowRenderer from 'react-test-renderer/shallow';

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

  it('should render match DOM Snapshot', () => {
    const shallow = new ShallowRenderer();
    shallow.render(<Watching watchedBounties={bounties} complete={true} />);
    const tree = shallow.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });

  it('should let user open BountyCardDetailsModal', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<Watching watchedBounties={bounties} complete={true} />);

    // ASSERT
    for (let i = 0; i < bounties.length; i++) {
      const bounty = bounties[i];
      const orgName = await screen.findAllByText(`${bounty.owner}/${bounty.repoName}`);
      await user.click(orgName[i]);
      if (bounty.status == 1) {
        const bountyStatus = await screen.findAllByText(/Closed/i);
        expect(bountyStatus[0]).toBeInTheDocument();
      }
      const link = await screen.findAllByText(/Full Contract/i);
      expect(link[0]).toBeInTheDocument();
      // should not have null or undefined values
      const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
      expect(nullish).toHaveLength(0);
    }
  });
});
