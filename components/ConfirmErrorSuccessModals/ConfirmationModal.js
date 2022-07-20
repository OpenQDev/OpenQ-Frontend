// Third party
import React from 'react';

const ConfirmationModal = ({
	setShowConfirmationModal,
	positiveOption,
	confirmMethod,
	confirmationTitle,
	confirmationMessage,
}) => {
	const updateModal = () => {
		setShowConfirmationModal(false);
	};

	/*   let notifyRef = useRef();
	notificationRef(notifyRef); */

	return (
		<div>
			<div onClick={() => updateModal()} className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-1/4">
					<div className="border-0 rounded-lg p-7 shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-center justify-center border-solid">
							<div className="flex flex-row">
								<div className="text-3xl  font-semibold pb-8">
									{confirmationTitle}
								</div>
							</div>
						</div>
						<div className="flex-auto">
							<p className="text-md  pb-12 text-center">
								{confirmationMessage}
							</p>
						</div>
						<div className="flex items-center">
							<button
								className=" background-transparent confirm-btn font-bold px-6 py-2 text-lg"
								type="button"
								onClick={() => {
									updateModal();
									confirmMethod();
								}}
							>
								{positiveOption}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-overlay fixed inset-0"></div>
		</div>
	);
};

export default ConfirmationModal;
