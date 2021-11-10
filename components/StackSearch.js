// Third Party
import React from 'react';

const StackSearch = () => {
	const addTags = (event) => {
		console.log('Key entered' + event);
	};

	return (
		<div className="flex font-mont rounded-lg border border-gray-200 py-2 px-3 text-base font-bold cursor-pointer w-1/2">
			<div className="flex flex-grow flex-row space-x-2">
				<button className="rounded-lg border border-blue-500 py-1 px-2 text-base font-bold cursor-pointer ">
					<div className="flex flex-row space-x-2 items-center">
						<span>Javascript</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</button>
				<button className="rounded-lg border border-pink-500 py-1 px-2 text-base font-bold cursor-pointer">
					<div className="flex flex-row items-center space-x-2">
						<span>NodeJs</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</button>
				<input
					className="bg-gray-100 w-6/7 border-gray-100 outline-none"
					type="text"
					placeholder="Press enter to add tags"
					onKeyUp={addTags}
				/>
			</div>
		</div>
	);
};

export default StackSearch;
