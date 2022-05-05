// Third party
import React, { useState } from 'react';
// Custom
import MintBountyModal from './MintBountyModal';

const MintBountyButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className="lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap font-mont rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
			>
				Mint Bounty
			</button>
			{showModal && 
					<MintBountyModal modalVisibility={setShowModal} />
			}
		</>
	);
};

export default MintBountyButton;
