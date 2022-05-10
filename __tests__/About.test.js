// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import About from '../components/About/About';
import mocks from '../__mocks__/mock-server.json';
 

describe('About', ( ) => {
	const organizationData = mocks.organizations.map((organization, index)=>{
	
		return {...mocks.githubOrganizations[index], ...organization};});
	beforeEach(()=>{
		const observe = jest.fn();
		const disconnect = jest.fn();

		window.IntersectionObserver = jest.fn(() => ({
			observe,
			disconnect,
		}));
	});
	const test =(organizationData)=>{
		
		it('should render generic About', async()=>{	
			// ARRANGE;
			render(<About organizationData={organizationData} tokenValues={mocks.tvl}/>);
			const title = screen.getByText(organizationData.id);
			const sum = screen.getByText('$100.32');
			// ACT
			expect(title).toBeInTheDocument();
			expect(sum).toBeInTheDocument();
		});
	};

		
	organizationData.forEach(organizationData=>test(organizationData));
});