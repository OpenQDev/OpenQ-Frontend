import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useContext } from 'react';
import MintBountyContext from './MintBountyStore/MintBountyContext';
import { NOTIFICATIONS_CLOSED } from './States';

const BountyMintedNotification = ({
	bountyAddress,
	issueUrl,
	notificationRef,
}) => {
	let notifyRef = useRef();
	notificationRef(notifyRef);

	const [, setMintBountyState] = useContext(MintBountyContext);

	return (
		<div className="bg-dark-mode">
			<div
				ref={notifyRef}
				className="flex flex-col bg-purple-600 bg-opacity-20 border border-purple-700 rounded-lg text-white p-4 text-white outline-none focus:outline-none"
			>
				<div className="flex flex-row justify-between space-x-5">
					<div className="flex flex-row space-x-2">
						<div className="font-bold">Bounty Minted</div>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
								/>
							</svg>
						</div>
					</div>
					<button onClick={() => setMintBountyState(NOTIFICATIONS_CLOSED())}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="pt-2 font-light">
          You can now view the bounty on our page and fund it
				</div>
				<div className="pt-2 font-semibold">Smart Contract</div>
				<div className="cursor-pointer">
					<CopyAddressToClipboard data={bountyAddress} />
				</div>
				<div className="flex pt-3 justify-end space-x-2">
					<div>
						<Link href={issueUrl}>
							<>
								<a
									target="_blank"
									rel="noreferrer"
									className="cursor-pointer text-link pt-3"
								>
									<Image
										src="/BountyMaterial/github-white.png"
										alt="Picture of the author"
										width={20}
										height={20}
									/>
								</a>
							</>
						</Link>
					</div>

					<div>
						<Link
							href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/address/${bountyAddress}`}
						>
							<>
								<a
									target="_blank"
									rel="noreferrer"
									className="cursor-pointer text-link pt-3"
								>
									<Image
										src="/BountyMaterial/polyscan-white.png"
										alt="Picture of the author"
										width={20}
										height={20}
									/>
								</a>
							</>
						</Link>
					</div>
					<div>
						<Link
							href={`/?address=${bountyAddress}}`}
							as={`/bounty/${bountyAddress}`}
						>
							<>
								<a
									target="_blank"
									rel="noreferrer"
									className="cursor-pointer text-link pt-3"
								>
									<Image
										src="/BountyMaterial/openq-white.png"
										alt="Picture of the author"
										width={20}
										height={20}
									/>
								</a>
							</>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BountyMintedNotification;
