/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyClosed from '../../components/BountyClosed/BountyClosed';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';

describe('BountyClosed', () => {

	const bounties = mocks.bounties;	

	const test = (bounty) => {

		it('should render the heading', () => {
			// ARRANGE
			render(<BountyClosed bounty={bounty} showTweetLink={true} />);
			// ACT
			const heading = screen.getByText('This contract is closed.');
			const subheading = screen.getByText('You cannot initiate actions on a closed contract.');
			// ASSERT
			expect(heading).toBeInTheDocument();
			expect(subheading).toBeInTheDocument();

		});

		it('should render no link or links to prs', () => {
			// ARRANGE
			render(<BountyClosed bounty={bounty} />);
			// ASSERT
			if(bounty?.prs?.some(pr => pr.source['__typename'] === 'PullRequest' && pr.source.url) > 0) {
				const pr = screen.getByText('Linked Pull Requests');
				expect(pr).toBeInTheDocument();
			} else {
				const pr = screen.getByText('No linked pull requests');
				expect(pr).toBeInTheDocument();
			}
		});

	};

	bounties.forEach(bounty => { test(bounty); });
});