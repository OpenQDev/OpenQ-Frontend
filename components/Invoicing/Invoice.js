import React, {useCallback, useEffect, useState, useContext} from 'react';
import {useRouter} from 'next/router';
import { jsPDF } from 'jspdf';
import StoreContext from '../../store/Store/StoreContext';

const Invoice = ({bounty})=>{
	console.log(bounty);
	const [appState] = useContext(StoreContext);
	const tokeNames = appState.tokens.map(token=>token.name);
	const srcPdf = useCallback((iframe)=>{
		if(iframe){
			let pl=0;
			const doc = new jsPDF();
			console.log(doc);
			doc.setFontSize(18);
			doc.setTextColor('#000000');
			doc.setFont('Montserrat', 'normal', 'bold');
			doc.text('Christopher Stevers', 20, pl+=20);
			doc.setFont('Montserrat', 'normal', 'normal');
			doc.text('5/4/2022', 140, pl);
			doc.setFontSize(12);
			doc.text('5146 Perth line 44', 20, pl+=6);
			doc.text('christopher.stevers1@gmail.com', 20, pl+=6);
			doc.table(
				20,
				pl+=36,
				[{Task:'Issue Nameme', USDC: '2          ','WETH': '400', 'MATIC': '200', 'WBTC':'1000', 'Total Value Claimed':'400,000' }], ['Task', 'USDC', 'WETH', 'MATIC', 'WBTC', 'Total Value Claimed'
				],{autoSize: 'true'} );
			iframe.src=	doc.output('datauristring');
		}
	},[]);

	return(<div className='flex invoice-wraooer justify-center p-8'>
	 <iframe className='w-5/6 h-screen iframe' ref={srcPdf} />
	</div>);
};

export default Invoice;