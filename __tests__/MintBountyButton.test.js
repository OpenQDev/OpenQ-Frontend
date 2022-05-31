// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import MintBountyButton from '../components/MintBounty/MintBountyButton';
import userEvent from '@testing-library/user-event';

const issues= [
	{status: 'not-issue',
		url: 'asdfsadf'
	},
	{
		status: 'mintable',
		url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/218'
	},
	{
		status: 'minted',
		url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/218'
	},
	{
		status: 'unknown',
		url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/219'
	},
];

const test =(issue)=>{
	
	console.log(issue);
	it('should render the modal', async() => {
		const user = userEvent.setup();
		render(<MintBountyButton />);
		
		const	mintBountyButton =  await screen.findByRole('button', {name: /Mint Bounty/i});
		
			
		await user.click(mintBountyButton);
		const input = await screen.findByRole('textbox');
		await user.type(input, issue.url);
	
		switch(issue.status){
		case 'mintable': {
			
			const text = await screen.findByText(/sdfsdf/i);
			const mintBountyArr = await screen.findAllByText(/Mint Bounty/i);
			await user.click(mintBountyArr[2]);
			expect(text).toBeInTheDocument();
		}
			break;
		case 'minted': {
			const text = await screen.findByText(/already minted/i);
			const link = await screen.findByText(/here./);
			expect(text).toBeInTheDocument();
			expect(link).toBeInTheDocument();
		}
			break; 
		case 'unknown': {
			const text = await screen.findByText(/not found/i);
			expect(text).toBeInTheDocument(); 
			break;
		}
		case 'not-issue': {
			const text = await screen.findByText(/Create a Bounty/i);
			expect(text).toBeInTheDocument();
		}	
		}
	
	}		
	);
	
};
describe('MintBountyButton', ( ) => {
	issues.forEach((issue)=>test(issue));
});