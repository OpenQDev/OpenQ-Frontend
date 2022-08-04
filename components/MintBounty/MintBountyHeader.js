import React from 'react';

export default function MintBountyHeader({type}) {
	return (
		<div className="flex flex-col items-center justify-center p-5 rounded-t">
			<h3 className="text-3xl  font-semibold">Deploy {type} Contract</h3>
			<h3 className="text-2xl pt-3 w-2/3 text-center text-gray-300">
				Create an {type} Contract to send funds to any GitHub issue
			</h3>
		</div>
	);
}