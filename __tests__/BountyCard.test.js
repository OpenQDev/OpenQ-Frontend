// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import BountyCard from '../components/Bounty/BountyCard';
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
	const test =(bounty)=>{
		it('should render BountyCard', async()=>{
			// ARRANGE
			render(<BountyCard bounty={bounty} complete={true}/>);
			
			// ASSERT
			const bountyTitle =	screen.getByText(bounty.title.toLowerCase());
			expect(bountyTitle).toBeInTheDocument();			
		});

		it('should let user open BountyCardDetailsModal', async()=>{			
			// ARRANGE
			const user = userEvent.setup();		
			render(<BountyCard bounty={bounty} complete={true}/>);
			
			// ASSERT
			const bountyTitle =	screen.getByText(bounty.title.toLowerCase());
			await user.click(bountyTitle);
			const link = await screen.findByText(/See full/i);
			expect(link).toBeInTheDocument();
		});
	};

		
	bounties.forEach(bounty =>test(bounty));
});