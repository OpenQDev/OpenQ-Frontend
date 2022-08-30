
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import BountyCardLean from '../../components/BountyCard/BountyCardLean';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';
import mocks from '../../__mocks__/mock-server.json';
import axios from 'axios';
 

describe('BountyCard', ( ) => {
	const newBounties = mocks.bounties;
	const fullBounties = [];
	
	jest.mock('axios');

	axios.get.mockResolvedValueOnce({status: true});
	axios.post.mockResolvedValueOnce({status: true});
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	newBounties.forEach((bounty) => {

		const relatedIssue = issueData.find(
			(issue) => issue.id == bounty.bountyId
		);
		if(relatedIssue){
			const mergedBounty = { ...bounty, ...relatedIssue };
			fullBounties.push(mergedBounty);
		}
	});

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
			render(<BountyCardLean bounty={bounty} complete={true}/>);
			
			// ASSERT
			const orgName = screen.getByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
			// ACT
			expect(orgName).toBeInTheDocument();
		});

		it('should let user open BountyCardDetailsModal', async()=>{			
			// ARRANGE
			const user = userEvent.setup();		
			render(<BountyCardLean bounty={bounty} complete={true}/>);
			
			// ASSERT
			const orgName = screen.getByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
			await user.click(orgName);
			if(bounty.status==1){				
				const bountyStatus = await	screen.findAllByText(/Closed/i);
				expect(bountyStatus[0]).toBeInTheDocument();
			}
			const link = await screen.findAllByText(/Full Contract/i);			
			expect(link[0]).toBeInTheDocument();
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
		});
	};

		
	fullBounties.forEach(bounty =>test(bounty));
});