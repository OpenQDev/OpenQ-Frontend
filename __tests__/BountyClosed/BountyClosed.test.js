/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyClosed from '../../components/BountyClosed/BountyClosed';
import mocks from '../../__mocks__/mock-server.json';
import { waitFor } from '@testing-library/react';

describe('BountyClosed', () => {
  const bounties = mocks.bounties;

  const test = (bounty) => {
    it('should render the heading', async () => {
      // ARRANGE
      render(<BountyClosed bounty={bounty} />);
      // ACT
      await waitFor(() => {
        const heading = screen.getByText('This contract is closed.');
        const subheading = screen.getByText('You cannot initiate actions on a closed contract.');
        // ASSERT
        expect(heading).toBeInTheDocument();
        expect(subheading).toBeInTheDocument();
      });
    });

    it('should render the linked transaction', async () => {
      // ARRANGE
      render(<BountyClosed bounty={bounty} />);
      // ACT
      await waitFor(() => {
        const transactionText = screen.getByText('Linked Closing Transaction');
        // ASSERT
        expect(transactionText).toBeInTheDocument();
      });
    });

    it('should render a tweet link when just claimed', async () => {
      // ARRANGE
      render(<BountyClosed bounty={bounty} showTweetLink={true} />);
      // ASSERT
      await waitFor(() => {
        const tweet = screen.getByText('Tweet about it');
        expect(tweet).toBeInTheDocument();
      });
    });
  };

  bounties.forEach((bounty) => {
    test(bounty);
  });
});
