// test/pages/index.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../test-utils';
import TokenBalances from '../components/TokenBalances/TokenBalances';

// Test cases for full balances, empty balances, and undefined balances.
const tokenBalanceCases = 
[[{tokenAddress:'0x0000000000000000000000000000000000000000',
	volume:'1000000000000000000',
	'__typename':'BountyFundedTokenBalance'
},
{tokenAddress:
'0x5fbdb2315678afecb367f032d93f642f64180aa3',
volume:'2000000000000000000'
,__typename:'BountyFundedTokenBalance'
},{tokenAddress:'0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
	volume:'3000000000000000000',
	__typename:'BountyFundedTokenBalance'
}], 
[],
null];

// Test cases for 
const tokenValuesCases=
		[{tokenPrices:{'0x8f3cf7ad23cd3cadbd9735aff958023239c6a063':1,
			'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':13.95,
			'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270':1.41},
		'tokens':{'0x8f3cf7ad23cd3cadbd9735aff958023239c6a063':3.0029999999999997,
			'0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39':27.9,
			'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270':1.41},'total':32.31},  null];
const singles = [false, true];
const showOnes = [false, true];
const headers =['header', ''];
const test =(tokenBalances, tokenValues, singleCurrency, header, showOne)=>{
	
	it('should render the balances', () => {
		const {container}=render(<TokenBalances tokenBalances={tokenBalances} showOne={showOne} singleCurrency = {singleCurrency} tokenValues={tokenValues} header={header} />);
		// header display if it exists
		if(header){
			const header = screen.getByText('header');
			expect(header).toBeInTheDocument();
		}
		// tokenValues but empty balances
		if( tokenBalances?.length===0 && tokenValues && !showOne ){
			const TVL = screen.getByText( '$32.31');
			expect(TVL).toBeInTheDocument();
		}

		// null tokenValues but some balances
		if(!tokenValues && tokenBalances?.length >0){
			const skeleton = container.querySelector('.react-loading-skeleton');
			expect (skeleton).toBeInTheDocument();
		}

		//tokenValues and tokenBalances
		else if(tokenBalances?.length >0 && tokenValues){
			if(showOne){
				
				const balanceText = screen.getByText(
					'2.0 LINK'
				);
				expect(balanceText).toBeInTheDocument();
			}
			else{
				const TVL = screen.getByText( '$32.31');
				expect(TVL).toBeInTheDocument();
				const balanceText = screen.getByText(
					'1.0 MATIC'
				);
				expect(balanceText).toBeInTheDocument();}
		}
	});};
describe('TokenBalances', ( ) => {
	tokenBalanceCases.forEach(tokenBalances=>{
		tokenValuesCases.forEach(tokenValues=>{
			singles.forEach(single=>{
				headers.forEach((header)=>{ 
					showOnes.forEach(showOne=>{
						test(tokenBalances, tokenValues, single, header, showOne);
					});
				}	);
			});
		});
	});
});