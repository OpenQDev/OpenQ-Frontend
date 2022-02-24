// Third Party
import React, { useContext } from 'react';
import Image from 'next/dist/client/image';
import { ethers } from 'ethers';

// Custom
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';

const AboutFundingValue = ({ organizationFunding, addressValueArray }) => {
	const [appState] = useContext(StoreContext);

	const { logoURI, symbol, decimals } = appState.tokenMetadata[ethers.utils.getAddress(addressValueArray[0])];

	return (
		<li className='font-semibold py-2 flex justify-between items-center leading-loose'>
			<Image
				width={32}
				height={32} src={logoURI} />
			<span>
				{addressValueArray[1] != null && addressValueArray[1] != {}
					? appState.utils.formatter.format(addressValueArray[1])
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