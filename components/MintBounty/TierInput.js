import React, {useState} from 'react'

const TierInput = ({tier}) => {

	const [prize, setPrize] = useState();


	return (
		<div className='flex-1 w-full mt-2 ml-4'>
			<input
				className={`flex-1 input-field w-full`}
				id={tier}
				placeholder={`${tier} winner`}
				autoComplete="off"
				type="text"
				value={prize}
				onChange={(e) => setPrize(e.target.value)}
			/>
		</div>
	)
}

export default TierInput