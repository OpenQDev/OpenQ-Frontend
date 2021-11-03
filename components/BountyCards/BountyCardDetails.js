import React from 'react';
import CopyAddressToClipboard from '../tools/CopyAddressToClipboard';
import DisplayPrice from './BountyCardComps/DisplayPrice';
import Image from 'next/image';
import Link from 'next/link';

const BountyCardDetails = (props) => {
	const {
		orgName,
		issue,
		repoName,
		labels,
		address,
	} = props;

	return (
		<div className="flex flex-col pl-16 pr-16 pt-10 pb-10">
			<div className="flex flex-col border-b border-solid rounded-t">
				<div className="flex flex-row space-x-20 justify-between">
					<div className="flex flex-col">
						<div className="text-xl">{orgName}/{repoName}</div>
						<div className="text-xl font-bold">
							{issue.title}
						</div>
					</div>
					<div>
						<Image
							src="/openq-logo.png"
							alt="avatarUrl"
							width="51"
							height="51"
						/>
					</div>
				</div>
				<div className="flex flex-row pt-5 space-x-10">
					<div className="flex flex-col">
						<div className="font-bold">Status</div>
						<div className="flex flex-row items-center space-x-2">
							<div className="pt-1">
								{' '}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="#15FB31"
									viewBox="0 0 16 16"
									width="15"
									height="15"
								>
									<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
									<path
										fillRule="evenodd"
										d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
									></path>
								</svg>
							</div>
							<div>Opened 3 days ago</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="font-bold">Smart Contract</div>
						<div className="flex flex-row items-center space-x-2 cursor-pointer">
							<CopyAddressToClipboard data={address} />
						</div>
					</div>
				</div>
				<div className="flex flex-row pt-3 space-x-2">
					<div className="space-x-2">
						{labels.map((label, index) => {
							if (index < 2) {
								return (
									<button
										key={index}
										className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
									>
										{label.name}
									</button>
								);
							} else if (index == 2) {
								return (
									<button
										key={index}
										className="font-mont rounded-lg text-xs py-1 px-2 font-bold bg-purple-500 text-white"
									>
										more..
									</button>
								);
							} else {
								null;
							}
						})}
					</div>
				</div>
				<div className="flex flex-col pt-4 pb-6">
					<div className="font-semibold text-gray-700">
						Total Value Locked (TVL)
					</div>
					<div className="font-bold text-xl">$243,13</div>
					<div className="flex flex-row space-x-2 pt-1">
						<div className="flex pt-1 w-5 h-5 items-center">
							{' '}
							<DisplayPrice />
						</div>
						<div className="flex flex-row space-x-1 items-center">
							<div>243,13</div>{' '}
							<div className="flex font-semibold">DAI</div>
						</div>
					</div>
				</div>
			</div>
			{/*body*/}
			<div className="flex flex-col pt-5">
				<div className="flex flex-row justify-between">
					<div className="font-bold text-xl">Description</div>
					<div className="flex flex-row font-bold text-xl space-x-2">
						<Link href={issue.url} passHref>
							<a target="_blank" rel="noreferrer">
								<div id={'github-link'} className='cursor-pointer' >
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
								</div>
							</a>
						</Link>
						<Link
							href={`/?address=${address}}`}
							as={`/bounty/${address}`}
						>
							<a target="_blank" rel="noreferrer">
								<div id={'bounty-link'} className='cursor-pointer'>
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
						</Link>
						<div id={'favorite'} className='cursor-pointer'>
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
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
					</div>
				</div>
				<div className="pt-2">{issue.body}</div>
			</div>
		</div>
	);
};

export default BountyCardDetails;