// Third party
import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// Custom 
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';

const BountyLinks = ({ bounty, hideBountyLink, bountyAddress }) => {
	const { account } = useWeb3();
	const [watchDisabled, setWatchDisabled] = useState();
	const [watchingDisplay, setWatchingDisplay] = useState();
	const [appState, dispatch] = useContext(StoreContext);

	useEffect(() => {
		const watching = bounty?.watchingUserIds?.some(user => user === account);
		setWatchingDisplay(watching);
	}, [account]);

	const signMessage = async () => {
		const message = 'OpenQ';
		const signature = await window.ethereum
			.request({
				method: 'personal_sign',
				params: [message, account]
			});
		return signature;
	};

	const watchBounty = async () => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/hasSignature?address=${account}`, { withCredentials: true });
			if (response.data.status===false) {
				const signature = await signMessage();
				await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/verifySignature`,
					{
						signature,
						address: account
					}, { withCredentials: true }
				);
			}


			setWatchDisabled(true);

			if (watchingDisplay) {
				await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bountyAddress), account);
				setWatchingDisplay(false);
				setWatchDisabled(false);
			} else {
				await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bountyAddress), account);
				setWatchingDisplay(true);
				setWatchDisabled(false);
			}

			const payload = {
				type: 'UPDATE_RELOAD',
				payload: true
			};

			dispatch(payload);
		} catch (error) {
			console.error(error);
		}
	};

	const tweetText = `Check out this bounty ${bounty?.owner && `for ${bounty?.owner}`} on OpenQ. You can claim it just by making a pull request that completes the issue! `;
	const { safe } = useWeb3();

	const resetScroll = () => {
		if (safe) {
			document.body.style.height = 'auto';
			document.body.style.overflowY = 'auto';
		}
	};

	return (
		<div className="flex flex-row font-bold text-xl space-x-4">
			{!hideBountyLink ? bounty ? <Link
				href={`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.id}/${bounty.bountyAddress}`}	>
				<a onClick={resetScroll} target={safe ? '_self' : '_blank'} rel="noopener noreferrer" >
					<div id={'bounty-link'} className="cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="ffffff" width="24" height="24">
							<path fill="#ffffff" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z" />
						</svg>
					</div>
				</a>
			</Link> :
				<Skeleton width={'24px'} height={'24px'} /> :
				null}
			{bounty ? <Link href={bounty.url} passHref>
				<a target="_blank" rel="noreferrer">
					<div id={'github-link'} className="cursor-pointer">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="white"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
					</div>
				</a>
			</Link> :
				<Skeleton width={'24px'} height={'24px'} />}
			{bounty ? <Link
				href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/address/${bounty.bountyAddress}`}

			>
				<a target="_blank">
					<div id={'bounty-link'} className="cursor-pointer">
						<Image src="/BountyMaterial/polyscan-white.png" width={24} height={24} />
					</div>
				</a>
			</Link> :
				<Skeleton width={'24px'} height={'24px'} />}
			{bounty ? <Link
				href={`https://twitter.com/intent/tweet/?text=${tweetText}${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bounty.id}/${bounty.bountyAddress}`}

			>
				<a target="_blank" rel="noopener noreferrer" >
					<div id={'bounty-link'} className="cursor-pointer">
						<svg viewBox="0 0 128 128" width="24" height="24">
							<path d="M40.254 127.637c48.305 0 74.719-48.957 74.719-91.403 0-1.39 0-2.777-.075-4.156 5.141-4.547 9.579-10.18 13.102-16.633-4.79 2.602-9.871 4.305-15.078 5.063 5.48-4.02 9.582-10.336 11.539-17.774-5.156 3.743-10.797 6.38-16.68 7.801-8.136-10.586-21.07-13.18-31.547-6.32-10.472 6.86-15.882 21.46-13.199 35.617C41.922 38.539 22.246 26.336 8.915 6.27 1.933 20.94 5.487 39.723 17.022 49.16c-4.148-.172-8.207-1.555-11.832-4.031v.41c0 15.273 8.786 28.438 21.02 31.492a21.596 21.596 0 01-11.863.543c3.437 13.094 13.297 22.07 24.535 22.328-9.305 8.918-20.793 13.75-32.617 13.72-2.094 0-4.188-.15-6.266-.446 12.008 9.433 25.98 14.441 40.254 14.422" fill="#ffffff">
							</path>
						</svg>
					</div>
				</a>
			</Link> :
				<Skeleton width={'24px'} height={'24px'} />}
			{bountyAddress && account ?

				<button onClick={watchBounty} disabled={watchDisabled}>
					<div id={'bounty-link'} className="cursor-pointer">
						{
							watchingDisplay ?
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg> :
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
									<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>}
					</div>
				</button> :
				hideBountyLink && account && !bounty &&
				<Skeleton width={'24px'} height={'24px'} />}
		</div>
	);
};

export default BountyLinks;
