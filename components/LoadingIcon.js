// Third Party
import React from 'react';

const LoadingIcon = () => {
	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
				Loading...
			</div>
			<div className="opacity-25 fixed inset-0 bg-black"></div>
		</>
	);
};

export default LoadingIcon;
