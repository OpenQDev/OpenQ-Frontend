import React from 'react';

const LoadingIcon = (props) => {
	const color = props.bg;
	return (
		<div>
			{color == 'white' ? (
				<div>
					<svg
						className="h-5 w-5 mr-3 animate-spin
		rounded-full
		h-6
		w-6
		border-t-2 border-b-2 border-purple-500"
						viewBox="0 0 24 24"
					></svg>
				</div>
			) : (
				<div>
					<svg
						className="h-5 w-5 mr-3 animate-spin
				rounded-full
				h-6
				w-6
				border-t-2 border-b-2 border-white"
						viewBox="0 0 24 24"
					></svg>
				</div>
			)}
		</div>
	);
};

export default LoadingIcon;
