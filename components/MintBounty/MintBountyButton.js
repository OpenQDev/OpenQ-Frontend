// Third Party
import React, { useState } from 'react';
// Custom
import MintBountyModal from './MintBountyModal';

const MintBountyButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<button
				onClick={() => setShowModal(true)}
				className="font-mont rounded-lg bg-button-pink py-2 px-3 pr-5 pl-5 text-white font-bold cursor-pointer"
			>
				Mint Bounty
			</button>
			<div>
				{showModal && <MintBountyModal modalVisibility={setShowModal} />}
			</div>
		</div>
	);
};

export default MintBountyButton;
