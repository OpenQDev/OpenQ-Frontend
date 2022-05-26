import React from 'react';
import Link from 'next/link';
import useWeb3 from '../../hooks/useWeb3';

export default function BountyAlreadyMintedMessage({ bountyAddress, claimed, id }) {

	const {safe} = useWeb3();
	return (
		<div className="flex flex-row items-center space-x-1">
			<div className="pt-4 text-white">Bounty is already {claimed? 'claimed': 'minted'}, view</div>
			<Link
				href={`/?address=${bountyAddress}}?id=${id}`}
				as={`/bounty/${bountyAddress}?id=${id}`}
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