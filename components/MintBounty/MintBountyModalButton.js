import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty, account }) {
	const classes = `flex flex-row w-1/3 space-x-2 justify-center ${enableMint ? 'btn-default cursor-pointer' : 'btn-default cursor-not-allowed'}`;
	return (
		<button
			className={classes}
			type="button"
			onClick={() => mintBounty()}
			disabled={!enableMint}
		>
			{transactionPending ? <LoadingIcon bg="colored" /> : account ? 'Deploy Contract': 'Connect Wallet'}
		</button>
	);
}