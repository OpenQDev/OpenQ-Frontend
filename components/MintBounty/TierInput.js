import React, { useEffect, useState, useContext } from 'react';
import TokenFundBox from '../FundBounty/SearchTokens/TokenFundBox';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';

const TierInput = ({ tier }) => {

	// Context
	const [appState, dispatch] = useContext(StoreContext);
	const zeroAddressMetadata = {
		name: 'Matic',
		address: '0x0000000000000000000000000000000000000000',
		symbol: 'MATIC',
		decimals: 18,
		chainId: 80001,
		path: 'https://wallet-asset.matic.network/img/tokens/matic.svg'
	};

	// State
	const [suffix, setSuffix] = useState();
	const [volume, setVolume] = useState('');
	const [token, setToken] = useState(zeroAddressMetadata);

	// Methods
	function handleSuffix(tier) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = tier % 100;
		setSuffix(tier + (s[(v - 20) % 10] || s[v] || s[0]));
	}
	function onCurrencySelect(token) {
		setToken({ ...token, address: ethers.utils.getAddress(token.address) });
	}
	function onVolumeChange(volume) {
		appState.utils.updateVolume(volume, setVolume);
	}

	useEffect(() => {
		handleSuffix(tier);
	}, []);

	return (
		<div className='flex-1 w-11/12 mb-2 ml-4'>
			<TokenFundBox
				onCurrencySelect={onCurrencySelect}
				onVolumeChange={onVolumeChange}
				token={token}
				volume={volume}
				placeholder={`${suffix} winner`}
			/>
		</div>
	);
};

export default TierInput;