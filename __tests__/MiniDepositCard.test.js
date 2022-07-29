// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import MiniDepositCard from '../components/Bounty/MiniDepositCard';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 

describe('MiniDepositCard', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = mocks.githubIssues.map(issue=>InitialState.githubRepository.parseIssueData(issue));
	const deposits = InitialState.utils.combineBounties(newBounties, issueData).reduce((depositArray, bounty)=>[...depositArray, ...bounty.deposits],[] );


	const test =(deposit)=>{
		
		it('should render MiniDepositCard CLOSED', async()=>{
			// ARRANGE
			render(<MiniDepositCard status={'CLOSED'} deposit={deposit} />);
		
			
			// should not have null or undefined values
			expect(await screen.findByText(/\$\d+.\d+/));
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});
		
		it('should render MiniDepositCard OPEN', async()=>{
			// ARRANGE

			render(<MiniDepositCard status={'OPEN'} deposit={deposit} />);
		
			// ASSERT
			expect(await screen.findByText(/\$\d+.\d+/));
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});
	};

	deposits.forEach(deposit=>test(deposit));
});
	