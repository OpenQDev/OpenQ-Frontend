import React from 'react';

export default function MintBountyHeader({type}) {
	return (
		<div className="flex flex-col items-center justify-center p-5 pb-3 rounded-t">
			<h3 className="text-3xl text-center font-semibold">Deploy {type} Contract</h3>
			<h3 className="text-2xl pt-2 w-5/6 text-center text-gray-300">
				{type === 'Repeating' ? 
					'Pay out a fixed amount to any contributors who submit work to this bounty, as many times as you like'
					: `Create a${type==='Atomic'? 'n' : ''} ${type} Contract to send funds to any GitHub issue`
				}
				
			</h3>
		</div>
	);
}