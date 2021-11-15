// Third Party
import React, { useState } from 'react';
// Custom
import CreateBountyModal from './CreateBountyModal';

const CreateBountyButton = () => {
	const [showModal, setShowModal] = useState(false);

	return (
		<div>
			<button
				onClick={() => setShowModal(true)}
				className="font-mont rounded-lg bg-button-pink py-2 px-3 pr-5 pl-5 text-white font-bold cursor-pointer"
			>
				Create Bounty
			</button>
			<div>
				{showModal && <CreateBountyModal modalVisibility={setShowModal} />}
			</div>
		</div>
	);
};

export default CreateBountyButton;
