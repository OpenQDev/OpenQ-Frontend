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
			const title = screen.getByText(organizationData.login);
			const heading1= screen.getByText('Bounties');
			const heading2= screen.getByText('Contributors');
			// ACT
			expect(heading1).toBeInTheDocument();
			expect(title).toBeInTheDocument();
			expect(heading2).toBeInTheDocument();
		});
	};

		
	organizationData.forEach(organizationData=>test(organizationData));
});