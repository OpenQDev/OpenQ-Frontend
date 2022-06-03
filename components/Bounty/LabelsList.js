// Third party
import React from 'react';
import Skeleton from 'react-loading-skeleton';

// Custom

const LabelsList = ({ bounty }) => {
	console.log(bounty.labels);
	return (
		<div className="flex flex-row space-x-2">
			<ul>
				{bounty.labels && bounty.labels.map((label, index) => {
					return (
						<li
							key={index}
							className="rounded-lg text-xs mr-2 mb-px py-1 px-2 font-bold border border-purple-500  truncate inline list-style-none"
							style={{
								borderColor: `#${label.color}`,
								opacity: .9,
								color: `#${label.color}`,
							}}
						>
							{label.name}
						</li>
					);
				}) ||
					<>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
						<li className="rounded-lg text-xs py-1 px-2 font-bold border border-web-gray  inline list-style-none">
							<Skeleton width="10rem" height={'12px'} />
						</li>
					</>
				}
			</ul>
		</div>
	);
};

export default LabelsList;
