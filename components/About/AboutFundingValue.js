// Third Party
import React, { useContext } from 'react';
import Image from 'next/dist/client/image';
import { ethers } from 'ethers';

// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';

const AboutFundingValue = ({ activeFunding }) => {
	const [appState] = useContext(StoreContext);

	const { volume } = activeFunding;
	const { logoURI, symbol, decimals } = appState.tokenMetadata[ethers.utils.getAddress(activeFunding.tokenAddress)];
	const [tokenValues] = useGetTokenValues([activeFunding]);

	return (
		<li className='font-semibold py-2 flex justify-between items-center leading-loose'>
			<Image
				width={32}
				height={32} src={logoURI} />
			<span>
				{tokenValues != null && tokenValues != {}
					? appState.utils.formatter.format(tokenValues.total)
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