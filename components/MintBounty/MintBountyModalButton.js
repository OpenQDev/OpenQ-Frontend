import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty }) {
	const enableOrDisable = enableMint ? 'confirm-btn cursor-pointer' : 'confirm-btn-disabled cursor-not-allowed';
	const classes = `flex flex-row space-x-2 justify-center ${enableOrDisable}`;
	return (
		<button
			className={classes}
			type="button"
			onClick={() => mintBounty()}
			disabled={!enableMint}
		>
			{transactionPending ? <LoadingIcon bg="colored" /> : null}
			{transactionPending ? '' : 'Mint Bounty'}
		</button>
	);
}