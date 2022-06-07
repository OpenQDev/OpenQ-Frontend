// test/pages/index.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import TokenBalances from '../components/TokenBalances/TokenBalances';
// Test cases for full balances, empty balances, and undefined balances.
const tokenValues = {'tokenPrices':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':0.67},'tokens':{'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':8.040000000000001},'total':8.04};
const tokenBalances = [{'__typename':'BountyFundedTokenBalance','volume':'12000000000000000000','tokenAddress':'0x5fbdb2315678afecb367f032d93f642f64180aa3'}];

// Test cases for 
const test =(tokenBalances, tokenValues, singleCurrency, header, showOne)=>{
	
	it('should render the header', () => {
		render(<TokenBalances tokenBalances={tokenBalances} showOne={showOne} singleCurrency = {singleCurrency} tokenValues={tokenValues} header={header} />);
		// header display if it exists
		if(header){
			const header = screen.getByText('header');
			expect(header).toBeInTheDocument();
		}			
	});
		

	it('should render the balances', async() => {
		render(<TokenBalances tokenBalances={tokenBalances} singleCurrency = {singleCurrency} tokenValues={tokenValues} header={header} />);
		const tokenVolume = await screen.findByText(/12.0/);
		expect(tokenVolume).toBeInTheDocument();	
	});

	it('should render the header', async()=>{
		render(<TokenBalances tokenBalances={tokenBalances} showOne={true} singleCurrency = {singleCurrency} tokenValues={tokenValues} header={'daww'} />);
		const tokenVolume = await screen.findByText('daww');
		expect(tokenVolume).toBeInTheDocument();	
	});
};
describe('TokenBalances', ( ) => {
	test(tokenBalances, tokenValues,);
});