// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import FundPage from '../components/FundBounty/FundPage';
import mocks from '../__mocks__/mock-server.json';
import userEvent from '@testing-library/user-event';
 
const bounties = mocks.bounties;
const refreshBounty = ()=>{
	return null;
};

const test =(bounty, )=>{
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
	
	it('should let user submit and and handle too low funds', async()=>{
		const user = userEvent.setup();
		render(<FundPage bounty={bounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '200');
		expect(input).toHaveValue('200');
		const button = screen.getByRole('button', {name: /Fund/i});	await user.click(button);

		await user.click( screen.getByRole( 'button', {name: /Confirm/i}));
		const modalContent = await screen.findByText(/Too Low/i);
		await user.click( screen.getByRole('button', {name: 'Close'}));		
		expect(modalContent).not.toBeInTheDocument();
	});

	it('should let user submit and handle enough Matic', async()=>{
		const user = userEvent.setup();
		render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '3');
		expect(input).toHaveValue('3');
		const button = screen.getByRole('button', {name: /Fund/i});
		await user.click(button);
		await screen.findByText(/3 Matic/i);
		await user.click( screen.getByRole( 'button', {name: /Confirm/i}));
		const modalContent = await screen.findByText(/Transfer Complete!/i);
		await user.click( screen.getByRole('button', {name: 'Close'}));
		expect(modalContent).not.toBeInTheDocument();
	});
	/*
	it('should let user submit and handle enough Link', async()=>{
		const user = userEvent.setup();
		render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '0.30sdf');
		expect(input).toHaveValue('0.30');		
		await user.click( screen.getByText( /Matic/i));
		await user.click( screen.getByText( /Chainlink/i));
		const button = screen.getByRole('button', {name: /Fund/i});
		expect(button).toBeInTheDocument();
		await user.click(button);
		expect(screen.findByText('3 Chainlink Token'));
		await user.click( screen.getByRole( 'button', {name: /Confirm/i}));
		const modalContent = await screen.findByText(/Transfer Complete!/i);
		expect(modalContent).toBeInTheDocument();
		await user.click( screen.getByRole('button', {name: 'Close'}));
		expect(modalContent).not.toBeInTheDocument();
	});
*/
	it('should handle Link errors', async()=>{

		const user = userEvent.setup();
		render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '0.30sdf');
		expect(input).toHaveValue('0.30');		
		await user.click( screen.getByText( /Matic/i));
		await user.click( screen.getByText( /Chainlink/i));
		const button = screen.getByRole('button', {name: /Fund/i});
		expect(button).toBeInTheDocument();
		await user.click(button);
		const confirmButton = screen.getByRole('button', {name:/confirm/i});
		await user.click(confirmButton);
		const modalContent = await screen.findByText(/Something went wrong/i);
		expect(modalContent).toBeInTheDocument();
		await user.click( screen.getByRole('button', {name: 'Close'}));
		expect(modalContent).not.toBeInTheDocument();
	});

	it('should prevent user from entering over 1000', async()=>{
		const user = userEvent.setup();		
		render(<FundPage bounty={bounty} />);
		const input = screen.getByLabelText('amount');
		await user.type(input, '1000');
		const button = await screen.findByRole('button', {name: /Fund/i});
		await user.hover(button);
		const tooltip = await screen.findByText(/Must be between/);
		expect(tooltip).toBeInTheDocument();
	});

	it('should show tooltip', async()=>{
		const user = userEvent.setup();
		render(<FundPage bounty={bounty} />);
		const button = screen.getByRole('button', {name: /Fund/i});
		await user.hover(button);
		const tooltip = await screen.findByText(/indicate the volume you'd like to fund with./i);
		expect(tooltip).toBeInTheDocument();
	});
	
};
describe('FundPage', ( ) => {
	bounties.forEach(bounty => test(bounty));
});