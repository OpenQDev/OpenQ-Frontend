// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MiniBountyCard from '../../components/User/AboutModules/MiniBountyCard';
import mocks from '../../__mocks__/mock-server.json';
import InitialState from '../../store/Store/InitialState';
 

describe('MiniBountyCard', ( ) => {
	
	const subgraphBounty = {
		'__typename': 'Bounty',
		'bountyAddress': '0x13f7816057de7256daf5028eaf8e79775d3a27a3',
		'bountyId': 'I_kwDOGWnnz85I9Ahl',
		'bountyMintTime': '1654041044',
		'bountyClosedTime': null,
		'status': 'OPEN',
		'claimedTransactionHash': null,
		'deposits': [
			{
				'__typename': 'Deposit',
				'id': '0xd024e550ba670d71f23f336c63ed0aacda946c6836f416028ffa0888b1a4b691',
				'refunded': false,
				'refundTime': null,
				'expiration': '2592000',
				'tokenAddress': '0x5fbdb2315678afecb367f032d93f642f64180aa3',
				'volume': '12000000000000000000',
				'sender': {
					'__typename': 'User',
					'id': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
				},
				'receiveTime': '1642021044'
			}
		],
		'issuer': {
			'__typename': 'User',
			'id': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
		},
		'bountyTokenBalances': [
			{
				'__typename': 'BountyFundedTokenBalance',
				'volume': '12000000000000000000',
				'tokenAddress': '0x5fbdb2315678afecb367f032d93f642f64180aa3'
			}
		]
	};
	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});

		
	it('should render MiniBountyCard with link', ()=>{
		// ARRANGE
		render(<MiniBountyCard bounty={subgraphBounty} />);

		// ASSERT
		expect(screen.getByRole('link')).toBeInTheDocument();
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);

			
	});
	

});
	