import React, { useEffect, useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const TierInput = ({ tier }) => {

	// Context
	const [appState ] = useContext(StoreContext);

	// State
	const [suffix, setSuffix] = useState();
	const [volume, setVolume] = useState('');

	// Methods
	function handleSuffix(tier) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = tier % 100;
		setSuffix(tier + (s[(v - 20) % 10] || s[v] || s[0]));
	}
	function onVolumeChange(e) {
		appState.utils.updateVolume(e.target.value, setVolume);
	}

	useEffect(() => {
		handleSuffix(tier);
	}, []);

	return (
		<div className='flex-1 w-11/12 mb-1  ml-4'>
			<input 	placeholder={`${suffix} winner`} value={volume} onChange={onVolumeChange} className='input-field w-full' />
		</div>
	);
};

export default TierInput;