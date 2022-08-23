import React from 'react';
import Link from 'next/link';
import useWeb3 from '../../hooks/useWeb3';

export default function BountyAlreadyMintedMessage({ bountyAddress, closed, id }) {

	const { safe } = useWeb3();
	return (
		<div className="flex flex-row items-center space-x-1 pt-4 mx-4">
			<div className="text-white text-center">Bounty is already {closed ? 'closed' : 'minted'}, view 
				<Link
					href={`/?address=${id}/${bountyAddress}}`}
					as={`/bounty/${id}/${bountyAddress}`}
				>
					<a
						target={safe ? '_self' : '_blank'}
						rel="noreferrer"
						className="cursor-pointer text-link"
					>
				&nbsp;here.
					</a>
				</Link>
			</div>
		</div>
	);
}