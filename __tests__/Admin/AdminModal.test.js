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
const error = ['random error message']

const test = (modal) => {

	if (modal.type == 'Error') {
		modal.title == error;
	}

	it('should render the modal', () => {
		render(<AdminModal modal={modal} />);
		// header display if it exists

		// ASSERT
		let text;
		switch (modal.type) {
			case 'PayoutSchedule':
				text = screen.getByText('Payout Schedule Updated!');
				break;
			case 'Budget':
				text = screen.getByText('Budget Updated!');
				break;
			case 'Payout':
				text = screen.getByText('Payout Updated!');
				break;
			case 'Error':
				text = screen.getByText('random error message');
				break;
			case 'Closed Contest':
				text = screen.getByText('Contest Closed!');
				break;
			case 'Closed Repeatable':
				text = screen.getByText('Repeatable Contract Closed!');
				break;
		}
		expect(text).toBeInTheDocument();

		/* // should not have null or undefined values
		const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
		expect(nullish).toHaveLength(0); */
	}
	);

};
describe('AdminModal', () => {
	types.forEach(type => {
		const modal = {};
		modal.type = type;
		test(modal)
	});
});