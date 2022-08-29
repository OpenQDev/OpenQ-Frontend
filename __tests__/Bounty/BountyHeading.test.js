// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyHeading from '../../components/Bounty/BountyHeading';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('BountyHeading', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const prismaContracts = mocks.prismaBounties;	
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData, prismaContracts.bounties.bountyConnection.nodes);

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});

	const test =(bounty, price)=>{
		
		it('should render Bounty heading', async()=>{
			// ARRANGE
			render(<BountyHeading bounty={bounty} price={price}/>);

			// ASSERT
			const title = screen.getByText(/Good first issue/);
			expect(title).toBeInTheDocument();
			
			const mintBountyButton = screen.getByText(/Contract/);
			expect(mintBountyButton).toBeInTheDocument();
			
			const status = screen.getAllByText(/open||closed/);
			expect(status[0]).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	test(fullBounties[0], 19);
});