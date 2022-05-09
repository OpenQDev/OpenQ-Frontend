// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import BountyList from '../components/Bounty/BountyList';
import mocks from '../__mocks__/mock-server.json';
import userEvent from '@testing-library/user-event';
 

describe('BountyList', ( ) => {
	const bounties = mocks.bounties.map((bounty, index)=>{
		return	Object.assign(bounty, mocks.githubIssues[index] );});

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});
	const test =(bounties)=>{
		
		it('should allow user to search unfunded', async()=>{

			// ARRANGE
			const user = userEvent.setup();		
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			const fundedTitle = screen.getByText(/high/);
			expect(fundedTitle).toBeInTheDocument();
			const unfundedCheckbox = screen.getByLabelText(/unfunded/i);
			await user.click(unfundedCheckbox);
			const unfundedTitle = await screen.findByText(/UnfundedIssue/i);
			const claimedCheckbox = screen.getByLabelText(/claimed/i);
			await user.click(claimedCheckbox);
			const claimedTitle = await screen.findByText(/hey/i);

			// ASSERT
			expect(claimedTitle).toBeInTheDocument();
			expect(unfundedTitle).toBeInTheDocument();

			// ACT
			const searchBounties = await screen.findByLabelText('search text');
			expect(searchBounties).toBeInTheDocument();
			await user.type(searchBounties, 'unfundedIssue');

			// ASSERT
			const unfundedTitle2 = await screen.findByText(/UnfundedIssue/i);
			expect(unfundedTitle2).toBeInTheDocument();
			const fundedTitle2 = screen.queryByText(/high/);
			expect(fundedTitle2).not.toBeInTheDocument();

			// ACT 

			const searchButton = screen.getByRole('button', {name: 'Search'});
			await user.click(searchButton);
			const searchTags = await screen.findByRole('button', {name: 'Search Tags'});
			await user.click(searchTags);

			//ASSERT
			const fundedTitle3 = await screen.findByText(/high/);
			expect(fundedTitle3).toBeInTheDocument();

			//ACT
			const tagSearch = await screen.findByLabelText(/search tags/);
			await user.type(tagSearch, 'qwer');
			await user.keyboard('{Enter}');
			const tagBtn = await screen.findByRole('button', {name: '×'});

			// ASSERT
			expect(tagBtn).toBeInTheDocument();
			expect(fundedTitle3).not.toBeInTheDocument();
			await user.click(tagBtn);
			const unfundedTitle3 = await screen.findByText(/UnfundedIssue/i);
			expect(unfundedTitle3).toBeInTheDocument();

			// ACT
			await user.click(unfundedCheckbox);
			await user.click(claimedCheckbox);

			// ASSERT
			const unfundedTitle4 = screen.queryByText(/UnfundedIssue/i);
			expect(unfundedTitle4).toBeFalsy();
			const claimedTitle2 = screen.queryByText(/Hey/i);
			expect(claimedTitle2).toBeFalsy();
		});

	};

	test(bounties);
});