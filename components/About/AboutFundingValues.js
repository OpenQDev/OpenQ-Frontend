import React, { useContext } from 'react';
import Image from 'next/dist/client/image';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';

const AboutFundingValue=({activeFunding})=>{
	const [appState]= useContext(StoreContext);
	
	const {volume}= activeFunding[0];
	const {logoURI, symbol, decimals}=appState.tokenMetadata[activeFunding[0].tokenAddress];
	
	const [value]=useGetTokenValues(activeFunding);
	console.log(logoURI);
	
	return(

		<li className='font-semibold  flex justify-between items-center leading-loose'>
			<Image 
				width={32}
				height={32} src={logoURI}/>
			<span> 
				{value != null && value != {}
					? appState.utils.formatter.format(value.total)
					: appState.utils.formatter.format(0)}
			</span>
			<span className='font-semi-bold'>(
				{ethers.utils.formatUnits(
					ethers.BigNumber.from(volume.toString()), parseInt(decimals)
				)}
				{' '}
				{symbol})
			</span>
		</li>
	);
};
export default AboutFundingValue;