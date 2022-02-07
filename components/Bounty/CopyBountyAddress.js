// Third Party
import React from 'react';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const CopyBountyAddress = ({ bounty }) => {
	return (
		<div className="flex flex-col text-white">
			<div className="font-bold">Smart Contract</div>
			<div className="flex flex-row items-center space-x-2 cursor-pointer">
				<CopyAddressToClipboard data={bounty.bountyAddress} />
			</div>
		</div>
	);
};

export default CopyBountyAddress;
