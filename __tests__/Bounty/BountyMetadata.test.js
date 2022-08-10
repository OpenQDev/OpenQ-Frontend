// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import BountyMetadata from '../../components/Bounty/BountyMetadata';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('BountyMetadata', ( ) => {
	const newBounties = mocks.bounties;	
	const	issueData = InitialState.githubRepository.parseIssuesData(mocks.githubIssues);
	const fullBounties = InitialState.utils.combineBounties(newBounties, issueData);

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
			render(<BountyMetadata bounty={bounty} setInternalMenu={()=>null} price={price}/>);

			// ASSERT
			const usdPrice = screen.getByText('$19');
			expect(usdPrice).toBeInTheDocument();
			const label = screen.getByText('L2E');
			expect(label).toBeInTheDocument();
			const polygonscan = screen.getByText('0x13f7816057 ... 775d3a27a3');
			expect(polygonscan).toBeInTheDocument();
			const prs = screen.getByText(/No linked pull/);
			expect(prs).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	test(fullBounties[0], 19);
});