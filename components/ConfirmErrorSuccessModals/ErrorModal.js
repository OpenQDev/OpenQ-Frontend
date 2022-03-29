// Third Party
import React from 'react';

const ErrorModal = ({ setShowErrorModal, error }) => {
	const { title, message } = error;

	const updateModal = () => {
		setShowErrorModal(false);
	};

	return (
		<div>
			<div onClick={()=>updateModal()} className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-dark-mode  outline-none focus:outline-none">
						<div className="flex items-start justify-center p-5">
							<h3 className="text-3xl font-semibold text-white">{title}</h3>
						</div>
						<div className="p-5 flex-auto">
							<p className="text-white text-lg leading-relaxed">
								{message}
							</p>
						</div>
						<div className="flex items-center justify-end p-6">
							<button
								className="confirm-btn"
								type="button"
								onClick={() => updateModal()}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="fixed inset-0 bg-overlay"></div>
		</div>
	);
};

export default ErrorModal;
