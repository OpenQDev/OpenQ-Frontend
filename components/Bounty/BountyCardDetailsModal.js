// Third Party
import React, { useEffect, useRef } from 'react';

// Custom
import BountyCardDetails from './BountyCardDetails';

const BountyCardDetailsModal = (props) => {
	const { bounty, tokenValues, deposits } = props;

	let menuRef = useRef();

	const updateModal = () => {
		props.modalVisibility(false);
	};

	// close modal if clicked outside
	useEffect(() => {
		let handler = (event) => {
			if (!menuRef.current.contains(event.target)) {
				updateModal();
			}
		};
		window.addEventListener('mousedown', handler);

		return () => {
			window.removeEventListener('mousedown', handler);
		};
	});

	return (
		<div>
			<div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div
						ref={menuRef}
						className="rounded-lg shadow-lg  flex flex-col w-full bg-dark-mode"
					>
						<BountyCardDetails
							bounty={bounty}
							tokenValues={tokenValues}
							deposits={deposits}
							props={props}
						/>
					</div>
				</div>
			</div>
			<div className="opacity-80 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default BountyCardDetailsModal;
