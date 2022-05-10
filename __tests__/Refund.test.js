// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import RefundPage from '../components/RefundBounty/RefundPage';
import mocks from '../__mocks__/mock-server.json';
import InitialState from '../store/Store/InitialState';
import userEvent from '@testing-library/user-event';
 

describe('RefundPage', ( ) => {
	const bounties = mocks.bounties;
	beforeEach(()=>{
		InitialState.openQClient.reset();
	});
	const test =(bounty )=>{
		it('should render the heading', async() => {
		// ARRANGE
			const user = userEvent.setup();		
			render(<RefundPage bounty={bounty} />);

			// ACT
			const heading = screen.getByText('Your Deposits');
			const refundBtn = screen.getByText('Refund');
			await user.click(refundBtn);
			const confirmBtn = await screen.findByText('Yes, Refund!');
			await user.click(confirmBtn);
			// ASSERT
			expect(heading).toBeInTheDocument();
		});
	
	};

	test(bounties[0]);
});