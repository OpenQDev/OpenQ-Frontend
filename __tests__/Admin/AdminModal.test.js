/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import AdminModal from '../../components/Admin/AdminModal';

const types = [
	'PayoutSchedule',
	'Budget',
	'Payout',
	'Error',
	'Closed Contest',
	'Closed Repeatable'
]

const test = (setModal, modal) => {

	it('should render the modal', () => {
		render(<AdminModal setModal={setModal} modal={modal} />);
		// header display if it exists

		// ASSERT
		let text;
		switch (modal.type) {
			case 'PayoutSchedule':
				text = screen.getByText('Payout Schedule Updated!');
				break;
			case 'Budget':
				text = screen.getByText('Approving...');
				break;
			case 'Payout':
				text = screen.getByText('Transferring...');
				break;
			case 'Error':
				text = screen.getByText('Transaction confirmed! Check out your transaction with the link below:');
				break;
			case 'Closed Contest':
				text = screen.getByText('User Denied Transaction');
				break;
			case 'Closed Repeatable':
				text = screen.getByText('User Denied Transaction');
				break;
		}
		expect(text).toBeInTheDocument();

		// should not have null or undefined values
		const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
		expect(nullish).toHaveLength(0);
	}
	);

};
describe('AdminModal', () => {
	errors.forEach(error => approveTransferStates.forEach((state) => test(state, error)));
});