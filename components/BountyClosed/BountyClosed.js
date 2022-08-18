// Third party
import React, { useContext } from 'react';
import Link from 'next/link';

import StoreContext from '../../store/Store/StoreContext';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const BountyClosed = ({ bounty, showTweetLink }) => {

	const [appState] = useContext(StoreContext);
	const [tokenValues] = useGetTokenValues(bounty?.bountyTokenBalances || []);
	const TVL = tokenValues != null && tokenValues != {}
		? appState.utils.formatter.format(tokenValues.total)
		: appState.utils.formatter.format(0);
	// Hooks
	const tweetText = `💸 Just claimed a developer bounty from ${bounty.owner} on OpenQ for ${TVL} working on this issue: `;
	const url = `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${bounty.claimedTransactionHash}`;
	const claimantPullRequestURL = bounty.closerData;
	//Render
	return (
		<div className="w-2/3 lg:w-1/2 pb-20">
			<div className="flex flex-col space-y-5">
				<h2 className="flex text-3xl justify-center pt-16">Bounty Closed</h2>
				<div className="flex justify-center rounded-sm px-6 py-4 pb-4 cursor-pointer" >			
					<div className="my-2">Closing Transaction: <Link href={url}>
						<a target={'_blank'} rel="noopener norefferer"  className="cursor-pointer break-all">
							<span className="underline">{url}</span>
							{'  '}<svg className="h-3 inline" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z" />
							</svg>
						</a>
					</Link>
					{claimantPullRequestURL !== null ?
						<div className='py-4'>Closing Pull Request: <Link href={claimantPullRequestURL}>
							<a target="_blank" rel="noopener noreferrer" className='underline'>{claimantPullRequestURL}	
								{'  '}<svg className="h-3 inline" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z" />
								</svg></a></Link>
						</div> : null}
					</div>
					{showTweetLink && <Link
						href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.bountyId}/${bounty.bountyAddress}`}

					>
						<a className="hover:scale-105 animate-single-bounce duration-100" target="_blank" rel="noopener noreferrer">
							<svg viewBox="0 0 128 128" width="24" height="24">
								<path d="M40.254 127.637c48.305 0 74.719-48.957 74.719-91.403 0-1.39 0-2.777-.075-4.156 5.141-4.547 9.579-10.18 13.102-16.633-4.79 2.602-9.871 4.305-15.078 5.063 5.48-4.02 9.582-10.336 11.539-17.774-5.156 3.743-10.797 6.38-16.68 7.801-8.136-10.586-21.07-13.18-31.547-6.32-10.472 6.86-15.882 21.46-13.199 35.617C41.922 38.539 22.246 26.336 8.915 6.27 1.933 20.94 5.487 39.723 17.022 49.16c-4.148-.172-8.207-1.555-11.832-4.031v.41c0 15.273 8.786 28.438 21.02 31.492a21.596 21.596 0 01-11.863.543c3.437 13.094 13.297 22.07 24.535 22.328-9.305 8.918-20.793 13.75-32.617 13.72-2.094 0-4.188-.15-6.266-.446 12.008 9.433 25.98 14.441 40.254 14.422" fill="#ffffff">
								</path>
							</svg>
						</a>
					</Link>}
				</div>
			</div>
		</div>
	);
};

export default BountyClosed;
