import React from 'react';
import LoadingIcon from '../Loading/LoadingIcon';
import Link from 'next/link';

export default function MintBountyMessages({ mintBountyState }) {
	return (
		<>
			{mintBountyState.isValidUrl && !mintBountyState.issueFound && mintBountyState.isLoading ? (
				<div className="pl-10 pt-5">
					<LoadingIcon bg={'white'} />
				</div>
			) : null}
			{mintBountyState.isValidUrl && !mintBountyState.issueFound ? (
				<div className="pl-10 pt-5">Github Issue not found</div>
			) : null}
			<div className="flex flex-row justify-center space-x-1 px-8">
				{mintBountyState.isValidUrl && mintBountyState.issueClosed && mintBountyState.issueFound && !mintBountyState.bountyAddress ? (
					<div className="pt-3">
						This issue is already closed on GitHub
					</div>
				) : null}
			</div>
			{mintBountyState.isValidUrl && mintBountyState.bountyAddress && mintBountyState.issueFound ? (
				<>
					<div className="pt-3">Bounty is already minted, top up</div>
					<Link
						href={`/?address=${mintBountyState.bountyAddress}}`}
						as={`/bounty/${mintBountyState.bountyAddress}`}
					>
						<>
							<a
								target="_blank"
								rel="noreferrer"
								className="cursor-pointer text-link pt-3"
							>
								here.
							</a>
							<a target="_blank" rel="noreferrer">
								<div id={'bounty-link'} className="cursor-pointer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="#383838"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
										/>
									</svg>
								</div>
							</a>
						</>
					</Link>
				</>
			) : null}
		</>
	);
}
