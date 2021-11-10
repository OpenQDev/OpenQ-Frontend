// Third Party
import React, { useState } from 'react';

const CopyAddressToClipboard = (props) => {

	const [copySuccess, setCopySuccess] = useState('');

	const copyTextToClipboard = () => {
		navigator.clipboard.writeText(props.data);
		setCopySuccess('Copied!');
		setTimeout(function () {
			setCopySuccess('');
		}, 2000);
	};

	return (
		<div className="relative pt-2">
			<div
				onClick={copyTextToClipboard}
				className="flex flex-row space-x-1"
			>
				<div className="relative flex flex-col items-center group">
					{copySuccess ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
					)}
					{!copySuccess ? null : (
						<div className="absolute bottom-0 flex flex-col items-center hidden mb-6 ml-4 group-hover:flex">
							<span className="relative z-10 p-2 text-xs rounded-md leading-none text-gray-500 whitespace-no-wrap bg-gray-200 shadow-lg">
								Copied!
							</span>
							<div className="w-3 h-3 -mt-2 mr-4 rotate-45 bg-gray-200"></div>
						</div>
					)}
				</div>
				<div>
					{props.data.substring(0, 12)}
					...
					{props.data.substring(32)}
				</div>
			</div>
		</div>
	);
};

export default CopyAddressToClipboard;