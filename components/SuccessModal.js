// Third Party
import React from 'react';

const SuccessModal = (props) => {
	const { modalVisibility, message, transactionHash } = props;

	const updateModal = () => {
		modalVisibility(false);
	};

	return (
		<div>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				<div className="w-auto my-6 mx-auto max-w-3xl">
					<div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
						<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
							<h3 className="text-3xl font-semibold">Success!</h3>
						</div>
						<div className=" p-6 flex-auto">
							<p className="my-4 text-blueGray-500 text-lg leading-relaxed">
								{message}
							</p>
							<p className="my-4 text-blueGray-500 text-lg leading-relaxed underline">
								<a href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${transactionHash}`}>{process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/{transactionHash}</a>
							</p>
						</div>
						<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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
		</div>
	);
};


export default SuccessModal;
