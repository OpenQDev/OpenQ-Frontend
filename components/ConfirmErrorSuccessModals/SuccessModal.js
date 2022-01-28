// Third Party
import React from 'react';
import Image from 'next/image';

const SuccessModal = (props) => {
	const { successMessage, transactionHash, setShowSuccessModal } = props;

	const updateModal = () => {
		setShowSuccessModal(false);
	};

	return (
		<div>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-1/3 mx-auto max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-dark-mode outline-none focus:outline-none">
						<div className="flex items-start justify-center pt-8">
							<div className="text-3xl font-semibold text-white">Success!</div>
						</div>
						<div className="flex-auto pl-1 pr-1 justify-center">
							<p className="pt-5 pl-4 pr-4 text-center text-white">
								{successMessage}
							</p>
							<p className="pt-3 text-center justify-center">
								<a
									href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`}
								>
									<div className="flex flex-col justify-center">
										<div className="font-semibold pb-2 text-white">
                      Polygonscan
										</div>
										<div>
											<Image
												src="/BountyMaterial/polyscan.png"
												alt="Polygonscan"
												width="25"
												height="25"
											/>
										</div>
									</div>
								</a>
							</p>
						</div>
						<div className="flex items-center justify-end p-5 text-lg rounded-b">
							<button
								className="text-white confirm-btn"
								type="button"
								onClick={() => updateModal()}
							>
                Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-80 fixed inset-0 bg-black"></div>
		</div>
	);
};

export default SuccessModal;
