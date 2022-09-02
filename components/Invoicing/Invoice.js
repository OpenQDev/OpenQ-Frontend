import React, {useCallback,   useContext, useState} from 'react';
import { jsPDF } from 'jspdf';
import  'jspdf-autotable';
import { ethers } from 'ethers';
import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import ToolTipNew from '../Utils/ToolTipNew';
const Invoice = ({bounty})=>{
	const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);
	const [appState] = useContext(StoreContext);
	const [yourName, setYourName] = useState('');
	const [yourAddress, setYourAddress] = useState('');
	const [yourEmail, setYourEmail] = useState('');
	const [clientName, setClientName] = useState('');
	const [clientAddress, setClientAddress] = useState('');
	const [clientEmail, setClientEmail] = useState('');
	const [showPdf, setShowPdf] = useState();
	
	const [userData, updateUserData]= useState({
		yourName:'',
		yourAddress:'',
		yourEmail:'',
		clientName:'',
		clientAddress:'',
		clientEmail:''
	});
	const handleSubmit = (e)=>{
		e.preventDefault();
		updateUserData({
			yourName,
			yourAddress,
			yourEmail,
			clientName,
			clientAddress,
			clientEmail
		});
		setShowPdf(true);
	};
	const srcPdf = useCallback(async(iframe)=>{
		if(iframe && tokenValues && appState.tokenClient){
			const keys =	Object.keys(tokenValues.tokens);
			const tableData = keys.map((key)=>tokenValues.tokens[key].toFixed(2).toString());
			const tableHeaders = await	Promise.all(bounty.bountyTokenBalances.map(async(token)=>{
				const tokenMetadata =  appState.tokenClient.getToken(ethers.utils.getAddress(token.tokenAddress));
				return `${tokenMetadata.symbol||'CUSTOM'} valued in USD`;
			}));
			const total=	Object.values(tokenValues.tokens).reduce((accum, elem)=>{
				return accum+elem;
			});
			let pl=0;
			const doc = new jsPDF();
			doc.setFontSize(18);
			doc.setTextColor('#000000');
			doc.setFont('Montserrat', 'normal', 'bold');
			doc.text(userData.yourName, 20, pl+=20);
			doc.setFont('Montserrat', 'normal', 'normal');
			doc.setFontSize(12);
			doc.text(appState.utils.formatDate(Date.now(), true), 140, pl);
			doc.text(userData.yourAddress, 20, pl+=6);
			doc.text(userData.yourEmail, 20, pl+=6);
			doc.text('Bill to:', 20, pl+=20);
			doc.text(userData.clientName, 20, pl+=6);
			doc.text(userData.clientAddress, 20, pl+=6);
			doc.text(userData.clientEmail, 20, pl+=6);
			doc.setTableHeaderRow({autoSize: true});
			doc.autoTable({
				head: [['Task', ...tableHeaders, 'Total Value Claimed'],],
				body: [
					[bounty.title, ...tableData, total.toFixed(2).toString()],
					[{styles: {lineWidth: 0}, content: ''}, ...tableData.map(()=>{return {styles: {lineWidth: 0}, content: ''};}),	total.toFixed(2).toString()]
					// ...
				],
				startY: pl+=36,
				theme: 'grid',
				headStyles: {
					fillColor: '#000',
				}
			});
				
			iframe.src=	doc.output('datauristring');
		}
	},[tokenValues, userData]);

	return(
		<div>
			<h1 className='text-white text-4xl text-center'>Create Invoice</h1>
			<div className='grid xl:grid-cols-[1fr_1fr] gap-x-4 justify-center justify-items-center px-32 py-8'>
				<form className=' h-min' >
					<div className='grid md:grid-cols-[1fr_1fr] gap-4 align-content-start pb-4'><input onChange={(e)=>{setYourName(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="text" placeholder='Name'></input>
						<input onChange={(e)=>{setYourAddress(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="text" placeholder='Address'></input>
						<input onChange={(e)=>{setYourEmail(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="text" placeholder='Email'></input>
					</div>
					<div className='grid md:grid-cols-[1fr_1fr] gap-4 align-content-start py-4'>
						<input onChange={(e)=>{setClientName(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="text" placeholder='Client Name'></input>
						<input onChange={(e)=>{setClientAddress(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="text" placeholder='Client Address'></input>
						<input onChange={(e)=>{setClientEmail(e.target.value);}} className='bg-dark-mode border border-web-gray text-xl p-4 h-min rounded-lg focus:outline-none' type="email" placeholder='Client Email'></input>
					</div>
					
					<ToolTipNew toolTipText="Cannot generate invoice if there are no deposits." hideToolTip={tokenValues} outerStyles={'bottom-5'} >
						<button onClick={handleSubmit} disabled={!tokenValues} className={` ${!tokenValues ? 'confirm-btn-disabled' : 'confirm-btn' } col-span-2 my-4`}>Generate</button></ToolTipNew>
				</form>
				<iframe className={`h-screen flex-0 w-full ${showPdf?'visible':'sr-only' }`} ref={srcPdf} />
			</div></div>);
};

export default Invoice;