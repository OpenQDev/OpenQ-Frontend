// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import BountyLinks from '../components/Bounty/BountyLinks';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
import userEvent from '@testing-library/user-event';
 

describe('BountyLinks', ( ) => {
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

	const test =(bounty)=>{
		
		it('should render Bounty Links', ()=>{
			// ARRANGE
			render(<BountyLinks bounty={bounty} watchedBounties={[]}/>);

			// ASSERT
			const Images =  screen.getAllByRole('link');
			expect(Images).toHaveLength(4);
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

		it('should have a watched button', async()=>{
			// ARRANGE
			const user = userEvent.setup();	
			render(<BountyLinks bounty={bounty} watchedBounties={bounty} bountyAddress={bounty.bountyAddress}/>);

			// ASSERT
			const watchedButton = screen.getByRole('button');
			expect(watchedButton).toBeInTheDocument();
			await	user.click(watchedButton);
			expect(watchedButton).toBeInTheDocument();
		});

	};

	fullBounties.forEach(bounty=>test({...bounty, watchingUsers: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}));
});