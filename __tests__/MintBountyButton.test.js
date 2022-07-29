// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import MintBountyButton from '../components/MintBounty/MintBountyButton';
import userEvent from '@testing-library/user-event';
import InitialState from '../store/Store/InitialState';

const issues= [
	{status: 'not-issue',
		url: 'asdfsadf'
	},
	{
		status: 'mintable',
		url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/21'
	},
	{
		status: 'minted',
		url: 'https://github.com/OpenQDev/OpenQ-TestRepo/issues/221'
	},
	{
		status: 'unknown',
		url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/2190'
	},
];

InitialState.openQClient.shouldSleep = 200;
const test =(issue)=>{
	
	it('should render the modal', async() => {
		// ARRANGE
		const user = userEvent.setup();
		render(<MintBountyButton />);

		// ACT		
		const	mintBountyButton =  await screen.findByRole('button', {name: /New Contract/i});			
		await user.click(mintBountyButton);
		const input = await screen.findByRole('textbox');
		await user.type(input, issue.url);
	

		// ASSERT
		switch(issue.status){
		case 'mintable': {
			expect(await screen.findByText(/mintable/i)).toBeInTheDocument();
			const mintBountyArr = await screen.findAllByText(/Deploy Contract/i);
			await user.click(mintBountyArr[2]);
		}
			break;

		case 'minted': {
			expect(await screen.findByText(/already minted/i)).toBeInTheDocument();
			expect( await screen.findByText(/here./)).toBeInTheDocument();
		}
			break;

		case 'unknown': {
			expect(await screen.findByText(/not found/i)).toBeInTheDocument(); 
		}
			break;

		case 'not-issue': {
			expect( await screen.findByText(/Create an atomic contract/i)).toBeInTheDocument();
		}	
		}
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);
	}		
	);
	
};
describe('MintBountyButton', ( ) => {
	issues.forEach((issue)=>test(issue));
});