/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '../../../test-utils';
import BountyMetadata from '.';
import Constants from '../../../test-utils/constant';

describe('BountyMetadata', () => {
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
    it('should render Bounty heading', async () => {
      // ARRANGE
      await waitFor(async () => {
        render(<BountyMetadata bounty={bounty} setInternalMenu={() => null} />);
        //await waitFor(async () => {
        const label = screen.getByText('duplicate');
        expect(label).toBeInTheDocument();
        const polygonscan = screen.getByText(/0x3c57cd5933/);
        expect(polygonscan).toBeInTheDocument();
        const prs = screen.getByText(/merged/);
        expect(prs).toBeInTheDocument();
        if (bounty.bountyType === Constants.bountyTypeFixed) {
          expect(await screen.findByText(/Fixed/));
        }
        if (bounty.bountyType === Constants.bountyTypeSplit) {
          expect(await screen.findByText(/Split/));
        }
        if (bounty.bountyType === Constants.bountyTypeContest) {
          expect(await screen.findByText(/Contest/));
        }
        if (bounty.bountyType === Constants.bountyTypeFixedContest) {
          expect(await screen.findByText(/Fixed Contest/));
        }

        // should not have null or undefined values
        const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
        expect(nullish).toHaveLength(0);
      });
    });
    // });
    // ASSERT
  };
  bounties.forEach((bounty) => {
    test(bounty);
  });
});
