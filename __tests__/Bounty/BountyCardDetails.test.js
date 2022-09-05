
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyCardDetails from '../../components/Bounty/BountyCardDetails';
import { waitFor} from '@testing-library/react';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 
// WARNING If you change the mock data for issues you may need to change some
// of this test's getByText invocations to getAllByText.
describe('BountyCardDetails', ( ) => {

	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const prismaContracts = mocks.prismaBounties;
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData, prismaContracts.bounties.bountyConnection.nodes);
	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};



	const test =(bounty)=>{
		
		it('should render BountyDetails', async()=>{

			// Arrange
			render(<BountyCardDetails bounty={bounty} address={bounty.bountyAddress} tokenValues={tokenValues} />);

			// ASSERT
			await waitFor(()=>{

				const usdValue = screen.queryAllByText(/\$\d+.\d+/);
				expect(usdValue[0]).toBeInTheDocument();				
			
				if(bounty.id ==='I_kwDOGWnnz85LAu6g'){
					expect(screen.getByText(/Update README/i)).toBeInTheDocument();
				}
				else{
					expect (screen.getByText(/No linked/i)).toBeInTheDocument();
				}


			});

			
		});

	};

	fullBounties.forEach(bounty => {test(bounty);});
});