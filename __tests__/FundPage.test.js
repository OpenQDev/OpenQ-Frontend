// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import FundPage from '../components/FundBounty/FundPage';
import mocks from '../__mocks__/mock-server.json';
import userEvent from '@testing-library/user-event';
import InitialState from '../store/Store/InitialState';
 

describe('FundPage', ( ) => {
	const bounties = [mocks.bounties[0]];
	const refreshBounty = ()=>{
		return null;
	};
	beforeEach(()=>{
		InitialState.openQClient.reset();
	});
	const test =(bounty, )=>{
		it('should render the heading', () => {
		// ARRANGE
			render(<FundPage bounty={bounty} />);

			// ACT
			const heading = screen.getByText('Fund Bounty');
			// ASSERT
			expect(heading).toBeInTheDocument();
		});

		it('should render list items', () => {

			// ARRANGE
			render(<FundPage bounty={bounty} />);

			// ACT
			const token = screen.getByText('MATIC');

			// ASSERT
			expect(token).toBeInTheDocument();
		});
	
		it('should let user submit and handle too low amount of token', async()=>{

			// ARRANGE
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '200');
			const button = screen.getByRole('button', {name: /Fund/i});
			await user.click(button);
			const confirmBtn = await screen.findByRole( 'button', {name: /Confirm/i});
			await user.click(confirmBtn);
			const modalContent = await screen.findByText(/Too Low/i);

			// ASSERT
			expect(modalContent).toBeInTheDocument();
			await user.click( screen.getByRole('button', {name: 'Close'}));
			expect(modalContent).not.toBeInTheDocument();
		});

		it('should let user submit and handle owned amount of Matic', async()=>{

			// ARRANGE
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '3');
			const button = screen.getByRole('button', {name: /Fund/i});
			await user.click(button);
			const value = await screen.findByText(/3 Matic/i);

			// ASSERT
			expect(value).toBeInTheDocument();
			const confirmBtn = screen.getByRole( 'button', {name: /Confirm/i});
			await user.click(confirmBtn);
			const modalContent = await screen.findByText(/Transfer Complete!/i);
			await user.click( screen.getByRole('button', {name: 'Close'}));
			expect(modalContent).not.toBeInTheDocument();
		});
	
		it('should let user submit and handle owned amount of Link', async()=>{

			// ARRANGE
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '0.30sdf');
			await user.click( screen.getByText( /Matic/i));
			await user.click( screen.getByText( /Chainlink/i));
			const button = screen.getByRole('button', {name: /Fund/i});
			await user.click(button);
			const value = await screen.findByText(/.30 Chainlink Token/i);

			// ASSERT
			expect(value);
			const confirmBtn = await screen.findByRole( 'button', {name: /Confirm/i});
			await user.click(confirmBtn);
			const modalContent = await screen.findByText(/Transfer Complete!/i);
			expect(modalContent).toBeInTheDocument();
			await user.click( screen.getByRole('button', {name: 'Close'}));
			expect(modalContent).not.toBeInTheDocument();
		});

		it('should handle approval errors', async()=>{
			// ARRANGE
			InitialState.openQClient.shouldError = true;
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '0.30sdf');
			await user.click( screen.getByText( /Matic/i));
			await user.click( screen.getByText( /Chainlink/i));
			const button = await screen.findByRole('button', {name: /Fund/i});
			await user.click(button);

			// ASSERT
			expect(await screen.findByText(/0.30 Chainlink Token/));
			await user.click( await screen.findByRole( 'button', {name: /Confirm/i}));
			const modalContent = await screen.findByText(/ transaction failed! Please reload and try again/i);
			expect(modalContent).toBeInTheDocument();
		
			await user.click(await  screen.findByRole('button', {name: 'Close'}));
			expect(modalContent).not.toBeInTheDocument();
		});

		it('should prevent user from submitting over 1000', async()=>{

			// ARRANGE
			const user = userEvent.setup();		
			render(<FundPage bounty={bounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '1000');
			const button = await screen.findByRole('button', {name: /Fund/i});

			// ASSERT
			expect(button).toBeDisabled();
			await user.hover(button);
			const tooltip = await screen.findByText(/Must be between/);
			expect(tooltip).toBeInTheDocument();
		});

		it('should prevent user from submitting over 1000', async()=>{

			// ARRANGE
			const user = userEvent.setup();		
			render(<FundPage bounty={bounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '0.00000001');
			const button = await screen.findByRole('button', {name: /Fund/i});

			// ASSERT
			expect(button).toBeDisabled();
			await user.hover(button);
			const tooltip = await screen.findByText(/Must be between/);
			expect(tooltip).toBeInTheDocument();
		});

		it('should show tooltip', async()=>{

			// ARRANGE
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} />);

			// ACT / ASSERT
			const button = screen.getByRole('button', {name: /Fund/i});
			expect(button).toBeDisabled();
			await user.hover(button);
			const tooltip = await screen.findByText(/indicate the volume you'd like to fund with./i);
			expect(tooltip).toBeInTheDocument();
		});
	
	};

	bounties.forEach(bounty => test(bounty));
});