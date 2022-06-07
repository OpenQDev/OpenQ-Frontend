// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../test-utils';
import BountyList from '../components/Bounty/BountyList';
import InitialState from '../store/Store/InitialState';
import mocks from '../__mocks__/mock-server.json';
 

describe('BountyList', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});
	const test =(bounties)=>{
		
		it('should allow user to open BountyCardDetailsModal', async()=>{
			const user = userEvent.setup();
			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			const title = screen.getByText(/good first Issue/i);
			expect(title).toBeInTheDocument();
			await user.click(title);
			const titles =await screen.findAllByText(/good first issue/i);
			const link = await screen.findByText(/See Full Bounty/i);
			expect(titles[1]).toBeInTheDocument();
			expect(link).toBeInTheDocument();
			
		});

	};

	test(fullBounties);
});