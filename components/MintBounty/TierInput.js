import React, { useEffect, useState } from 'react';

const TierInput = ({ tier, tierVolume, onTierVolumeChange, style }) => {

	// State
	const [suffix, setSuffix] = useState();

	// Methods
	function handleSuffix(tier) {
		const s = ['th', 'st', 'nd', 'rd'];
		const v = tier % 100;
		setSuffix(tier + (s[(v - 20) % 10] || s[v] || s[0]));
	}

	useEffect(() => {
		handleSuffix(tier);
	}, []);

	return (
		<div className={`flex-1 w-11/12 mb-1  ml-4 ${style}`}>
			<input
				name={tier}
				id="tier-volume"
				autoComplete="off"
				placeholder={`${suffix} winner`}
				value={tierVolume || ''}
				onChange={onTierVolumeChange}
				className='input-field w-full number' />
		</div>
	);
};

export default TierInput;