// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '../test-utils';
import MintBountyButton from '../components/MintBounty/MintBountyButton';
import userEvent from '@testing-library/user-event';

const issues= [{
	status: 'ready',
	url: 'https://github.com/OpenQDev/OpenQ-Frontend/issues/218'
},
];

const test =()=>{
	
	
	it('should render the modal', async() => {
		const user = userEvent.setup();
		render(<MintBountyButton />);
		
		const	mintBountyButton = await screen.findByRole('button', {name: /Mint Bounty/i});
		
		await waitFor(async()=>{ 
			
			await user.click(mintBountyButton);
		});
		const	input = await screen.findByLabelText('issue url');
		expect(input).toBeInTheDocument();	}		
	);
	
};
describe('MintBountyButton', ( ) => {
	issues.forEach(issue => {test(issue);});
});