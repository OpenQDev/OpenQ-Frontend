// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import BountyHomepage from '../components/Bounty/BountyHomepage';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 

describe('BountyHomepage', ( ) => {
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

	const test =(bounties)=>{
		
		it('should render Bounty homepage', async()=>{
			// ARRANGE
			render(<BountyHomepage bounties={bounties} watchedBounties={[]}/>);

			// ASSERT
			const title1 = screen.getByText(/good first issue/i);
			expect(title1).toBeInTheDocument();
			const title2 = screen.getByText(/学習プログラムの再現性を確保する方法について/i);
			expect(title2).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	};

	test(fullBounties);
});