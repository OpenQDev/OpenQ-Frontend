// Third Party
import React, { useState } from 'react';
// Custom
import MintBountyModal from './MintBountyModal';
import MintBountyProvider from './MintBountyStore/MintBountyProvider';

const MintBountyButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className="col-start-1 lg:col-start-8 md:col-start-6 sm:col-start-4 font-mont w-full rounded-lg border border-web-gray py-2 px-6 text-white font-semibold cursor-pointer hover:border-white"
			>
				Mint Bounty
			</button>
			{showModal && (
				<MintBountyProvider>
					<MintBountyModal modalVisibility={setShowModal} />
				</MintBountyProvider>
			)}
		</>
	);
};

export default MintBountyButton;
