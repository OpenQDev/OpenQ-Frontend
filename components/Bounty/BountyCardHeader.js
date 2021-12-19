// Third Party
import React from 'react';
import Image from 'next/image';

// Custom

const BountyCardHeader = (props) => {
	const { bounty } = props;

	return (
		<div className="flex flex-row space-x-20 justify-between">
			<div className="flex flex-col">
				<div className="text-xl">
					{bounty.owner}/{bounty.repoName}
				</div>
				<div className="text-xl font-bold">{bounty.title}</div>
			</div>
			<div>
				<Image src={bounty.avatarUrl} alt="avatarUrl" width="51" height="51" />
			</div>
		</div>
	);
};

export default BountyCardHeader;
