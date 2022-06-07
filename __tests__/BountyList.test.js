// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import BountyList from '../components/Bounty/BountyList';
import InitialState from '../store/Store/InitialState';
import mocks from '../__mocks__/mock-server.json';
 

describe('BountyList', ( ) => {
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
	const test =(bounties)=>{
		
		it('should allow user to search unfunded', async()=>{

			// ARRANGE
			render(<BountyList bounties={bounties} complete={true}/>);

			// ACT
			const unfunded = screen.getByText('Unfunded');
			expect(unfunded).toBeInTheDocument();
			
		});

	};

	test(fullBounties);
});