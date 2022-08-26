// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import CopyBountyAddress from '../../components/Bounty/CopyBountyAddress';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('CopyBountyAddress', ( ) => {
	const bounty={
		'__typename': 'Bounty',
		'bountyAddress': '0x1f191c4166865882b26551fb8618668b7a67d0fb',
	};

	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});
		
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

	

	
});