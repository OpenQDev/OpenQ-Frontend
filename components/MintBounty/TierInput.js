import React, {useEffect, useState} from 'react'

const TierInput = ({tier}) => {

	const [prize, setPrize] = useState();
	const [suffix, setSuffix] = useState();

	function handleSuffix(tier) {
			const s = ['th', 'st', 'nd', 'rd'];
			const v = tier % 100;
			setSuffix(tier + (s[(v - 20) % 10] || s[v] || s[0]));
	}

	useEffect(() => {
		handleSuffix(tier);
	}, [])

	return (
		<div className='flex-1 w-full mt-2 ml-4'>
			<input
				className={`flex-1 input-field w-full`}
				id={tier}
				placeholder={`${suffix} winner`}
				autoComplete="off"
				type="text"
				value={prize}
				onChange={(e) => setPrize(e.target.value)}
			/>
		</div>
	)
}

export default TierInput