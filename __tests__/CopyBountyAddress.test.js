// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../test-utils';
import CopyBountyAddress from '../components/Bounty/CopyBountyAddress';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
 

describe('CopyBountyAddress', ( ) => {
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

	const test =(bounty)=>{
		
		it('should render CopyBountyAddress', ()=>{

			// ARRANGE
			render(<CopyBountyAddress address={bounty.bountyAddress} />);
			const addressRegex = new RegExp(bounty.bountyAddress.slice(0, 3));

			// ASSERT
			expect(screen.getByText(addressRegex));		
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);

			
		});

	

	};

	fullBounties.forEach(bounty=>test({...bounty, watchingUsers: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}));
});