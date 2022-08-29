/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyClosed from '../../components/BountyClosed/BountyClosed';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';

describe('BountyClosed', () => {

	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);

	const test = (bounty) => {

		it('should render the heading', () => {
			// ARRANGE
			render(<BountyClosed bounty={bounty} showTweetLink={true} />);
			// ACT
			const heading = screen.getByText('This contract is closed.');
			// ASSERT
			expect(heading).toBeInTheDocument();

		});

		it('should render links to prs', () => {
			// ARRANGE
			render(<BountyClosed bounty={bounty} />);
			// ACT
			const pr = screen.getByText('No linked pull requests');
			// ASSERT
			expect(pr).toBeInTheDocument();
		});

	};

	fullBounties.forEach(bounty => { test(bounty); });
});