// Third party
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const CopyBountyAddress = ({ bounty }) => {
	return (
		<div className="flex flex-col text-white">
			<div className="font-bold">Smart Contract</div>
			<div className="flex flex-row items-center space-x-2 cursor-pointer">
				{bounty ? <CopyAddressToClipboard data={bounty.bountyAddress} /> : <Skeleton height={'28px'} width={'15rem'} />}
			</div>
		</div>
	);
};

export default CopyBountyAddress;
