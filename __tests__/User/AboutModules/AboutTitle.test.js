
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../../test-utils';
import AboutTitle from '../../../components/User/AboutModules/AboutTitle';


describe('AboutTitle', () => {

	beforeEach(() => {
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});


	it('should render Bounty heading', async () => {
		// ARRANGE
		render(<AboutTitle ensName={'christopher.eth'} account={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'} githubUser={{login: 'Christopher-Stevers', avatarUrl: 'https://github.com/Deep1144'}}/>);

		// ASSERT
		expect(screen.getByText('christopher.eth')).toBeInTheDocument();
		expect (screen.getByText(/0xf3/)).toBeInTheDocument();


	});
	it('should render Bounty heading', async () => {
		// ARRANGE
		render(<AboutTitle ensName={null} account={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'} githubUser={{login: 'Christopher-Stevers', avatarUrl: 'https://github.com/Deep1144'}}/>);

		// ASSERT
		expect(screen.queryByText('christopher.eth')).not.toBeInTheDocument();
		expect (screen.getByText(/0xf3/)).toBeInTheDocument();


	});

});