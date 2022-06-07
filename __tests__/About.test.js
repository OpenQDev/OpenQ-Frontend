// test/components/FundPage/ApprovalTransferModal.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import About from '../components/About/About';
import mocks from '../__mocks__/mock-server.json';
 

describe('About', ( ) => {
	const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67,'0x0000000000000000000000000000000000000000': 0.65 },'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001,'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': 18.05},'total':8.04};

	const organizationData = mocks.organizations.map((organization, index)=>{	
		return {...mocks.githubOrganizations[index], ...organization};});

	const test =(organizationData)=>{
		
		it('should render generic About', async()=>{	
			// ARRANGE;
			render(<About tokenValues = {tokenValues} organizationData={organizationData} tokenValues={mocks.tvl}/>);
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