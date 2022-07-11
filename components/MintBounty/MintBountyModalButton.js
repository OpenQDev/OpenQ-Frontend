import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty, account }) {
	const classes = `flex flex-row space-x-2 justify-center ${enableMint ? 'confirm-btn' : 'confirm-btn-disabled'}`;
	return (
		<button
			className={classes}
			type="button"
			onClick={() => mintBounty()}
			disabled={!enableMint}
		>
			{transactionPending ? <LoadingIcon bg="colored" /> : account ? 'Mint Bounty': 'Connect Wallet'}
		</button>
	);
}