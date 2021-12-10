// Third Party
import React, { useState } from 'react';

// Custom
import FundModal from './FundModal';

const FundBountyButton = ({ bounty }) => {
	const [showModal, setShowModal] = useState(false);

	function showTokenSearch() {
		setShowModal(true);
	}

	// Render
	return (
		<div>
			<button
				className="flex flex-row space-x-1 bg-pink-600 text-white rounded-lg p-2 pr-2"
				onClick={() => showTokenSearch()}
			>Fund</button>
			{showModal ? (
				<FundModal setShowModal={setShowModal} bounty={bounty} />
			) : null}
		</div>
	);
};

export default FundBountyButton;
