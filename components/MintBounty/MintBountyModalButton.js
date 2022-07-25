import React from 'react';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

export default function MintBountyModalButton({ enableMint, transactionPending, mintBounty, account }) {
	return (
		<div className='flex flex-row w-full justify-center'>
			<button
				className={`flex w-1/3 items-center justify-center ${enableMint ? 'btn-default cursor-pointer' : 'btn-default cursor-not-allowed'}`}
				type="button"
				onClick={() => mintBounty()}
				disabled={!enableMint}
			>
				{transactionPending ? <LoadingIcon bg="colored" /> : account ? 'Deploy Contract' : 'Connect Wallet'}
			</button>
		</div>
	);
}