
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../test-utils';
import CopyAddressToClipboard from '../../components/Copy/CopyAddressToClipboard';
import InitialState from '../../store/Store/InitialState';
 

describe('ClaimPage', ( ) => {
	beforeEach(()=>{
		InitialState.openQClient.reset();
	});
	const test =()=>{
		it('should render the copyable content', async() => {
		// ARRANGE
			render(<CopyAddressToClipboard data="pat"/>);

			// ACT
			const copyText = screen.getByText(/pat/);
			
			expect(copyText).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
		});

		it('should render clip copyable content', async() => {
		// ARRANGE
			render(<CopyAddressToClipboard clipping={[2, 4]} data="patters"/>);

			// ACT
			const firstCopyText = screen.getByText(/pa/);
			const copyMiddleText = screen.getByText(/.../);
			const lastCopyText = screen.getByText(/ers/);
			expect(firstCopyText).toBeInTheDocument();
			expect(copyMiddleText).toBeInTheDocument();
			
			expect(lastCopyText).toBeInTheDocument();
			
			// should not have null or undefined values
			const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
			expect(nullish).toHaveLength(0);
		});
	
	};

	test();
});