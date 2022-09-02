// test/component/Utils/UnexpectedError.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import Dropdown from '../../components/Utils/Dropdown';
import userEvent from '@testing-library/user-event';
import nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
describe('Dropdown', () => {

	const mockDropdown = jest.fn();
	const title = 'pizzas';
	beforeEach(() => {
	});
	const names=['foo', 'bar'];

	it('should be render with title', async () => {
		// ARRANGE
		render(<Dropdown toggleFunc={mockDropdown} title={title} names={names} toggleVal={names[0]}/>
		);
		const displayTitle = screen.getByText('pizzas');
		const firstName =screen.getByText(names[0]);
		const altName = screen.getByText(names[1]);
		expect(firstName).toBeInTheDocument();
		expect(altName).toBeInTheDocument();
		expect(displayTitle).toBeInTheDocument();
	});


	it('should render firstname as title when !title prop', async () => {
		// ARRANGE
		render(<Dropdown toggleFunc={mockDropdown} title={title} names={names} toggleVal={names[0]}/>
		);
		const firstName =screen.getAllByText(names[0]);
		const altName = screen.getByText(names[1]);
		expect(firstName[0]).toBeInTheDocument();
		expect(altName).toBeInTheDocument();
	});


	it('should be useable dropdown', async () => {
		// ARRANGE
		const user = userEvent.setup();
		render(<Dropdown toggleFunc={mockDropdown} names={names} toggleVal={names[0]}/>
		);
		const defaultTitle =screen.getAllByText(names[0])[0];
		const altName = screen.getByText(names[1]);
		await user.click(defaultTitle);
		await user.click(altName);
		// ACT
		expect(mockDropdown).toHaveBeenCalledWith(names[1]);
	});

});
