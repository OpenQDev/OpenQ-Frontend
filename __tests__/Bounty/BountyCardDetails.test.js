// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 
// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', ( ) => {

	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);
	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};



	const test =(bounty)=>{
		
		it('should render BountyDetails', async()=>{

			// Arrange
			render(<BountyCardDetails bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues} />);

			// ASSERT
			if(bounty.deposits.length>0){				
				const usdValue = await screen.findAllByText(/(15.41||16.08||13.4)/i);
				expect(usdValue[0]).toBeInTheDocument();				
			}
			if(bounty.id ==='I_kwDOGWnnz85LAu6g'){
				expect(screen.getByText(/Update README/i)).toBeInTheDocument();
			}
			else{
				expect (screen.getByText(/No linked/i)).toBeInTheDocument();
			}

			
		});

	};

	fullBounties.forEach(bounty => {test(bounty);});
});