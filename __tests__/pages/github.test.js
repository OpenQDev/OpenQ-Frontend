
/**
 * @jest-environment jsdom
 */
import React from 'react';
import GithubAuth from '../../pages/auth/github';

import { render } from '../../test-utils';
import nextRouter from 'next/router';
 
 describe('GithubAuth', () => {
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
			prefetch: jest.fn(() => { return { catch: jest.fn }; })
		}));

	});

	it('should allow user to open BountyCardDetailsModal', async () => {
		render(<GithubAuth />)
	});

});