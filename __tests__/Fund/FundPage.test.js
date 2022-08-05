// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import FundPage from '../../components/FundBounty/FundPage';
import mocks from '../../__mocks__/mock-server.json';
import userEvent from '@testing-library/user-event';
import InitialState from '../../store/Store/InitialState';
 

describe('FundPage', ( ) => {
	const bounties = [mocks.bounties[0]];
	const refreshBounty = ()=>{
		return null;
	};
	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	
		InitialState.openQClient.reset();
		InitialState.shouldSleep = 200;
	});
	const test =(bounty, )=>{
		it('should render the heading', () => {
		// ARRANGE
			render(<FundPage bounty={bounty} />);

			// ACT
			const heading = screen.getByText('Fund');
			// ASSERT
			expect(heading).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
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
			const confirmBtn = await screen.findAllByRole( 'button', {name: /Fund/i});
			await user.click(confirmBtn[1]);
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
			const confirmBtn = await screen.findAllByRole( 'button', {name: /Fund/i});
			await user.click(confirmBtn[1]);
			const modalContent = await screen.findByText(/Transfer Complete/i);
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
			await user.click( screen.getAllByText( /link/i)[0]);
			const button = screen.getByRole('button', {name: /Fund/i});
			await user.click(button);
			const value = await screen.findByText(/.3 link/i);

			// ASSERT
			expect(value);
			const confirmBtn = await screen.findByRole( 'button', {name: /Approv/i});
			await user.click(confirmBtn);
			const funding = await screen.findByText('Funding');
			expect(funding).toBeInTheDocument();
			const close = await screen.findByText(/close/i, undefined, {
				timeout: 4000
			});
			await user.click( close);
			expect(close).not.toBeInTheDocument();
		});

		it('should handle approval errors', async()=>{
			// ARRANGE
			InitialState.openQClient.shouldError = true;
			const user = userEvent.setup();
			render(<FundPage bounty={bounty} refreshBounty={refreshBounty} />);

			// ACT
			const input = screen.getByLabelText('amount');
			await user.type(input, '0.30sdf');
			await user.click( await screen.findByText( /MATIC/i));
			await user.click( screen.getAllByText( /Chainlink/i)[0]);
			const button = await screen.findByRole('button', {name: /Fund/i});
			await user.click(button);

			// ASSERT
			expect(await screen.findByText(/0.3 LINK/));
			await user.click( await screen.findByRole( 'button', {name: /Approv/i}));
			const modalContent = await screen.findByText(/try again./i);
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