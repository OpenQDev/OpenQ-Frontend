// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import RepoTitle from '../components/Bounty/RepoTitle';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 
// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('RepoTitle', ( ) => {

	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);
	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};



	const test =(bounty)=>{
		
		it('should render BountyDetails', async()=>{

			// Arrange
			render(<RepoTitle bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues} />);

			// ASSERT
			
			const repoRegex = new RegExp(bounty.repoName, 'i');
			const repo = screen.getByText(repoRegex);
			expect(repo).toBeInTheDocument();
			
		});

	};

	fullBounties.forEach(bounty => {test(bounty);});
});