// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import CarouselBounty from '../components/Bounty/CarouselBounty';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 

describe('CarouselBounty', ( ) => {
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
		
		it('should render CarouselBounty', ()=>{
			// ARRANGE
			render(<CarouselBounty bounty={bounty} />);

			// ACT
			const repo = screen.getByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
			expect(repo).toBeInTheDocument();
			
			// ASSERT
			// can't do entire title, because emojis confuse jest.
			const titleRegex = new RegExp(bounty.title.slice(0, 5), 'i');
			const title = screen.getAllByText(titleRegex);
			expect(title[0]).toBeInTheDocument();		
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	

	};

	fullBounties.forEach(bounty=>test({...bounty, watchingUsers: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}));
});