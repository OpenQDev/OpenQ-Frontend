
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import LabelsList from '../../components/Bounty/LabelsList';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('LabelsList', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = mocks.githubIssues.map(issue=>InitialState.githubRepository.parseIssueData(issue));
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
		
		it('should render at least one label', ()=>{
			// ARRANGE
			render(<LabelsList bounty={bounty} />);
			if(bounty.labels[0]){
				// ASSERT
				expect(screen.getByText(bounty.labels[0].name));
			}
		
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	

	};

	fullBounties.forEach(bounty=>test({...bounty, watchingUsers: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}));
});