// Third Party
import React from 'react';

const BountyClosed = ({ bounty }) => {

	return (
		<div className="pt-16">
			<div className="flex flex-col space-y-5">
				<div className="bg-purple-600 col-span-3 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4">
					Bounty Is Already Closed at {process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/{bounty.claimedTransactionHash}
				</div>
			</div>
		</div>
	);
};

export default BountyClosed;
