import React from 'react';
import Link from 'next/link';
import useWeb3 from '../../hooks/useWeb3';

export default function BountyAlreadyMintedMessage({ bountyAddress, bountyId, claimed }) {

	const {safe} = useWeb3();
	return (
		<div className="flex flex-row items-center space-x-1">
			<div className="pt-4 text-white">Bounty is already {claimed? 'claimed': 'minted'}, view</div>
			<Link
				href={`/?address=${bountyAddress}}`}
				as={`/bounty/${bountyId}/${bountyAddress}`}
			>
				<a
					target={safe ? '_self' : '_blank'}
					rel="noreferrer"
					className="cursor-pointer text-link pt-4"
				>
					here.
				</a>
			</Link>
		</div>
	);
}