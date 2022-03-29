// Third Party
import React from 'react';

const LoadingIcon = ({closeModal}) => {
	return (
		<>
			<div onClick={closeModal} className="text-white flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" >
				<div className="px-8 py-4 bg-dark-mode rounded-lg">
					Loading...
				</div>
			</div>
			<div className="bg-overlay fixed inset-0"></div>
		</>
	);
};

export default LoadingIcon;
