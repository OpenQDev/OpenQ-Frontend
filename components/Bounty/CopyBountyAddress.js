// Third party
import React from 'react';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const CopyBountyAddress = ({ address }) => {
	return (
		<div className="flex flex-col ">
			<div className="font-bold">Smart Contract</div>
			<div className="flex flex-row items-center space-x-2 cursor-pointer">
				<CopyAddressToClipboard data={address} /> 
			</div>
		</div>
	);
};

export default CopyBountyAddress;
