import React, { useContext } from 'react';
import Image from 'next/dist/client/image';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';

const AboutFundingValue = ({ activeFunding }) => {
	const [appState] = useContext(StoreContext);
	console.log('activeFunding', activeFunding);
	const { volume } = activeFunding;
	const { logoURI, symbol, decimals } = appState.tokenMetadata[ethers.utils.getAddress(activeFunding.tokenAddress)];

	const [value] = useGetTokenValues([activeFunding]);

	return (
		<li className='font-semibold py-2 flex justify-between items-center leading-loose'>
			<Image
				width={32}
				height={32} src={logoURI} />
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