
/**
 * @jest-environment jsdom
 */
import React from 'react';

import { render, screen } from '../../test-utils';
import MiniBountyCard from '../../components/User/AboutModules/MiniBountyCard';


describe('MiniBountyCard', ( ) => {
	
	const payout = 
			{
				'bounty': {
					'issuer': {
						'id': '0x46e09468616365256f11f4544e65ce0c70ee624b'
					}
				},
				'volume': '600000000000000000',
				'tokenAddress': '0x0000000000000000000000000000000000000000'
			};
	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});

		
	it('should render MiniBountyCard with link', ()=>{
		// ARRANGE
		render(<MiniBountyCard payout={payout} />);

		// ASSERT
		expect(screen.getByRole('link')).toBeInTheDocument();
			
		// should not have null or undefined values
		const nullish =  [...screen.queryAllByRole(/null/),	...screen.queryAllByRole(/undefined/)];		
		expect(nullish).toHaveLength(0);

			
	});
	

});
	