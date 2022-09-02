
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ClaimPage from '../../components/Claim/ClaimPage';
import axios from 'axios';
import InitialState from '../../store/Store/InitialState';
import userEvent from '@testing-library/user-event';
 

describe('ClaimPage', ( ) => {

	const bounty={
		'__typename': 'Bounty',
		'bountyAddress': '0x1f191c4166865882b26551fb8618668b7a67d0fb',
		'bountyId': 'I_kwDOBC3Cis5Kk2OD',
		'bountyMintTime': '1654260766',
		'bountyClosedTime': null,
		'status': 'OPEN',
		'bountyType': '2',
		'payoutSchedule': [
			'70',
			'20',
			'10'
		],
		'claimedTransactionHash': null,
		'deposits': [],
		'issuer': {
			'__typename': 'User',
			'id': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
		},
		'bountyTokenBalances': []
	};
	jest.mock('axios');
	axios.get = jest.fn().mockResolvedValue({data: {data:'true'}});
	
	beforeEach(()=>{	
		
		InitialState.openQClient.reset();
	});
	it('should render the heading', async() => {
		// ARRANGE
		const user = userEvent.setup();		
		render(<ClaimPage bounty={bounty} />);

		// ACT
		const claimBtn = screen.getByText('Claim');
		await user.click(claimBtn);

		// ASSERT
		const confirmBtn = await screen.findByText('Yes! Claim!');
		expect(confirmBtn).toBeInTheDocument();
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);
	});
	


});