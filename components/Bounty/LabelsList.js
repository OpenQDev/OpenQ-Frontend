// Third Party
import React from 'react';
import Skeleton from 'react-loading-skeleton';

// Custom

const LabelsList = ({ bounty }) => {
	
	return (
		<div className="flex flex-row pt-3 space-x-2">
			<div className="space-x-2 space-y-2">
				{bounty?.labels.map((label, index) => {
					console.log(label);
					return (
						<button
							key={index}
							className="rounded-lg text-xs py-1 px-2 font-bold border border-purple-500 text-white truncate"
							style={{
								borderColor: `#${label.color}`,
								opacity: .9,
								color: `#${label.color}`,
							}}
						>
							{label.name}
						</button>
					);
				})||
				<>
					<div className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray text-white inline-block">
						<Skeleton width="10rem" height={'12px'} />
					</div>
					<div className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray text-white inline-block">
						<Skeleton width="10rem" height={'12px'}/>
					</div>
				</>
				}
			</div>
		</div>
	);
};

export default LabelsList;
