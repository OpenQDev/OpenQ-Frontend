// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import BountyCardDetails from '../components/Bounty/BountyCardDetails';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 
// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', ( ) => {

	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);
	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};



	const test =(bounty)=>{
		
		it('should render BountyDetails', async()=>{

			// ASSERT
			render(<BountyCardDetails bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues} />);

			// ACT
			const repo = screen.getByText(`${bounty.owner}/${bounty.repoName}`);
			expect(repo).toBeInTheDocument();
			expect (screen.getAllByText(/Claimed/i)[0]).toBeInTheDocument();
			expect (screen.getByText(/Smart Contract/i)).toBeInTheDocument();
			if(bounty.deposits.length>0){
				expect(screen.getByText(/Total Value/)).toBeInTheDocument();
				expect(document.querySelector('.react-loading-skeleton')).toBeInTheDocument();
				const usdValues = await screen.findAllByText(/8.04/i);
				expect(usdValues[0]).toBeInTheDocument();				
			}
			else{
				expect(screen.getByText(/No Deposits/i)).toBeInTheDocument();
			}
			expect(screen.getByText(/It may take up to one minute for new deposits to show up here/i));
			expect(screen.getByText(/0x/)).toBeInTheDocument();
			expect(screen.getAllByText(/Assign/i)).toHaveLength(2);

			
		});

	};

	fullBounties.forEach(bounty => {test(bounty);});
});