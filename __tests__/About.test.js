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

	const test =(organizationData)=>{
		
		it('should render generic About', async()=>{	
			// ARRANGE;
			render(<About organizationData={organizationData} tokenValues={mocks.tvl}/>);
			const title = screen.getByText(organizationData.id);
			const heading1= screen.getByText('Bounties');
			const sum = screen.getByText('$24.04');
			const heading2= screen.getByText('Contributors');
			const individual = await screen.findByText('$100.32');
			// ACT
			expect(individual).toBeInTheDocument();
			expect(heading1).toBeInTheDocument();
			expect(title).toBeInTheDocument();
			expect(heading2).toBeInTheDocument();
			expect(sum).toBeInTheDocument();
		});
	};

		
	organizationData.forEach(organizationData=>test(organizationData));
});