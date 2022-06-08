// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import BountyCard from '../components/Bounty/BountyCard';
import userEvent from '@testing-library/user-event';
import InitialState from '../store/Store/InitialState';
import mocks from '../__mocks__/mock-server.json';
 

describe('BountyCard', ( ) => {
	const newBounties = mocks.bounties;
	const fullBounties = [];
	
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
			render(<BountyCard bounty={bounty} complete={true}/>);
			
			// ASSERT
			const orgName = screen.getByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
			// ACT
			expect(orgName).toBeInTheDocument();
		});

		it('should let user open BountyCardDetailsModal', async()=>{			
			// ARRANGE
			const user = userEvent.setup();		
			render(<BountyCard bounty={bounty} complete={true}/>);
			
			// ASSERT
			const orgName = screen.getByText(`${bounty.owner.toLowerCase()}/${bounty.repoName.toLowerCase()}`);
			await user.click(orgName);
			if(bounty.status==='CLOSED'){				
				const bountyStatus = await	screen.findAllByText(/Claimed/i);
				expect(bountyStatus[0]).toBeInTheDocument();
			}
			const link = await screen.findAllByRole('link', {name:/See full/i});
			expect(link[0]).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
		});
	};

		
	fullBounties.forEach(bounty =>test(bounty));
});