import React from 'react';
import BountyCardDetails from './BountyCardDetails';

const BountyCardDetailsModal = (props) => {
	const {
		issueColor,
		issue,
		deposits,
		address,
	} = props;

	const updateModal = () => {
		props.modalVisibility(false);
	};

	return (
		<div>
			<div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div className="rounded-lg shadow-lg  flex flex-col w-full bg-white">
						<BountyCardDetails
							issue={issue}
							issueIsOpen={true}
							issueColor={issueColor}
							deposits={deposits}
							address={address}
						/>
						<div className="flex items-center justify-end">
							<button
								className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button"
								onClick={() => updateModal()}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</div >
	);
};

export default BountyCardDetailsModal;
