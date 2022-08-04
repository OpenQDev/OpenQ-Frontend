// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import ApprovalTranferModal from '../../components/FundBounty/ApproveTransferModal';
import {
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR
} from '../../components/FundBounty/ApproveTransferState';
 
const approveTransferStates = [
	CONFIRM,
	APPROVING,
	TRANSFERRING,
	SUCCESS,
	ERROR];
const errors = [		
	{
		title: 'User Denied Transaction',
		message: 'Thank You! Come Again!'}

];
const test =(approveTransferState, error)=>{
	
	it('should render the modal', () => {
		render(<ApprovalTranferModal approveTransferState={approveTransferState} error={error} />);
		// header display if it exists

		// ASSERT
		let text;
		switch(approveTransferState){
		case CONFIRM:
			text=screen.getByText('Confirm');
			break;
		case APPROVING:
			text = screen.getByText('Approving...');
			break;
		case TRANSFERRING:
			text = screen.getByText('Transferring...');
			break;
		case SUCCESS:
			text = screen.getByText('Transaction confirmed! Check out your transaction with the link below:');
			break;
		case ERROR:
			text = screen.getByText('User Denied Transaction');
			break;
		}
		expect(text).toBeInTheDocument();		
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);
	}			
	);
	
};
describe('ApprovalTranferModal', ( ) => {
	errors.forEach(error=>approveTransferStates.forEach((state)=>test(state, error)));	
});