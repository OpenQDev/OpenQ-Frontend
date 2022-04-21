// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import FundPage from '../components/FundBounty/FundPage';
import mocks from '../__mocks__/mock-server.json';
import userEvent from '@testing-library/user-event';
 
const bounty = mocks.bounty;

const test =(bounty, )=>{
	const user = userEvent.setup();
	it('should render the heading', () => {
		render(<FundPage bounty={bounty} />);
		const heading = screen.getByText('Fund Bounty');
		expect(heading).toBeInTheDocument();
	}		
	);
	it('should render the list', () => {
		render(<FundPage bounty={bounty} />);
		const token = screen.getByText('MATIC');
		expect(token).toBeInTheDocument();
	}
	);
	
	it('should let user enter number', async()=>{
		render(<FundPage bounty={bounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '200');
		expect(input).toHaveValue('200');
	});

	it('should prevent user from entering over 1000', async()=>{		
		render(<FundPage bounty={bounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '1000');
		expect(input).toHaveValue('100');
	});

	it('should show tooltip', async()=>{
		render(<FundPage bounty={bounty} />);
		const button = screen.getByRole('button', {name: /Fund/i});
		await user.hover(button);
		const tooltip = await screen.findByText(/indicate the volume you'd like to fund with./i);
		expect(tooltip).toBeInTheDocument();
	});
	
};
describe('FundPage', ( ) => {
	test(bounty);
});