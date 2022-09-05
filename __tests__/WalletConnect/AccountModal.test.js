// test/component/WatchButton/WatchButton.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import AccountModal from '../../components/WalletConnect/AccountModal';
import nextRouter from 'next/router';
// Test cases for full balances, empty balances, and undefined balances.

const chainId = 137;
const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const ensName = 'bungo';
const setIsConnecting = jest.fn();
const deactivate = jest.fn();

describe('AccountModal', () => {
	// Test cases for 

	const push = jest.fn(() => { return { catch: jest.fn }; });
	beforeEach(() => {
		const observe = jest.fn();
		const disconnect = jest.fn();
		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));

		nextRouter.useRouter = jest.fn();
		nextRouter.useRouter.mockImplementation(() => ({
			query: { type: null },
			prefetch: jest.fn(() => { return { catch: jest.fn }; }),
			push
		}));

	});

	it('should render account modal', async () => {
		// ARRANGE
		render(<AccountModal chainId={chainId} ensName={ensName} deactivate={deactivate} account={account} setIsConnecting={setIsConnecting} />
		);

		// ASSERT
		const nullish = [...screen.queryAllByRole(/null/), ...screen.queryAllByRole(/undefined/)];
		expect(nullish).toHaveLength(0);
	});


	it('should link to profile.', async () => {
		// ARRANGE
		const user = userEvent.setup();
		render(<AccountModal chainId={chainId} ensName={ensName} deactivate={deactivate} account={account} setIsConnecting={setIsConnecting} />
		);

		// ASSERT

		await user.click(await screen.findByRole('link'));
		expect(push).toHaveBeenCalledTimes(1);

	});

	it('should be able to deactivate.', async () => {
		// ARRANGE
		const user = userEvent.setup();
		render(<AccountModal chainId={chainId} ensName={ensName} deactivate={deactivate} account={account} setIsConnecting={setIsConnecting} />
		);

		// ASSERT
		await user.click(await screen.findByText(/disconnect/i));
		expect(deactivate).toHaveBeenCalledTimes(1);

	});

});