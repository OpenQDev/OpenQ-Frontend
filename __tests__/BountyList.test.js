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
			const claimedCheckbox = screen.getByLabelText(/claimed/i);
			await user.click(claimedCheckbox);
			const claimedTitle = await screen.findByText(/high/i);

			// ASSERT
			expect(claimedTitle).toBeInTheDocument();

			// ACT
			const searchBounties = await screen.findByLabelText('search text');
			expect(searchBounties).toBeInTheDocument();
			await user.type(searchBounties, 'unfundedIssue');

			// ASSERT
			const fundedTitle2 = screen.queryByText(/high/);
			expect(fundedTitle2).not.toBeInTheDocument();

			// ACT 

			const searchButton = screen.getByRole('button', {name: 'Search'});
			await user.click(searchButton);
			//ASSERT
			//ACT

			
		});

	};

	test(bounties);
});