
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import TotalValue from '../../components/Bounty/TotalValue';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('TotalValue', ( ) => {
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
		
		
		it('should render 0 in TotalValue', async()=>{
			// ARRANGE
			render(<TotalValue bounty={bounty} setInternalMenu={()=>null} price={price}/>);

			// ASSERT
			const usdPrice = screen.getByText('Total Value Locked $0.00');
			expect(usdPrice).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});
		
		it('should render >0 in TotalValue', async()=>{
			// ARRANGE
			render(<TotalValue bounty={bounty} tokenValues={{total: 90}}/>);

			// ASSERT
			const usdPrice = screen.getByText('Total Value Locked $90.00');
			expect(usdPrice).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});
		it('should render >0 that has already been claimed in TotalValue', async()=>{
			// ARRANGE
			render(<TotalValue bounty={{status: 'CLOSED'}} tokenValues={{total: 90}}/>);

			// ASSERT
			const usdPrice = screen.getByText('Total Value Claimed $90.00');
			expect(usdPrice).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	test(fullBounties[0], 19);
});