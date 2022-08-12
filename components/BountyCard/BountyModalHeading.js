// Third party
import Link from 'next/link';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {ethers} from 'ethers';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import {StackIcon} from '@primer/octicons-react';
import Image from 'next/image';

const BountyModalHeading = ({bounty, closeModal, unWatchable})=>{
	const { account } = useWeb3();
	const [appState, dispatch] = useContext(StoreContext);
	const [watchDisabled, setWatchDisabled] = useState();
	const [watchingDisplay, setWatchingDisplay] = useState();
	const { safe } = useWeb3();
	
	useEffect(async() => {
		if(account){
			const user = await appState.openQPrismaClient.getUser(account);
			if(user){

				const watching = user.watchedBountyIds?.some(bountyAddress => bountyAddress === bounty.address);
				setWatchingDisplay(watching);
			}
		}
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
		
		if(!account){const payload = {
			type: 'CONNECT_WALLET',
			payload: true
		};
		dispatch(payload);
		return; 
		}
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


			const payload = {
				type: 'RELOAD_NOW',
				payload: Date.now()
			};
			setWatchDisabled(true);
			if (watchingDisplay) {
				console.log('exec');
				const result = await appState.openQPrismaClient.unWatchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
				console.log(result);
				setWatchingDisplay(false);
				if(result){
					dispatch(payload);
				}
				setWatchDisabled(false);
			} else {
				console.log('exic');
				const result = await appState.openQPrismaClient.watchBounty(ethers.utils.getAddress(bounty.bountyAddress), account);
				if(result){
					dispatch(payload);
				}
				setWatchingDisplay(true);
				setWatchDisabled(false);
			}

		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="flex flex-col sm:flex-row justify-between px-8 mb-2">
			<div className="flex flex-col mb-2">
				<span>
					<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/organization/${bounty.owner}`}>
						<a className='text-link-colour hover:underline'>
							{bounty.owner}
						</a>
					</Link>
					<span className='text-muted'> / {bounty.repoName}
					</span>
				
				</span>
				<h2 className='text-xl flex-1 leading-tight md:w-96'><span className='flex text-primary break-word'>{bounty.title} </span>
					<Link href={bounty.url} className='text-muted text font-light'><a target="_blank" className='text-link-colour hover:underline'>#{bounty.number}</a></Link>
				</h2>
			</div>
			<div className='min-w-[40px]  flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-2'>
				<Link href={`/bounty/${bounty.id}/${bounty.bountyAddress}`} >
					<a onClick={closeModal} target={safe ? '_self' : '_blank'} rel="noopener noreferrer" >
						<div className='flex gap-3 items-center text-xs text-primary bg-inactive-gray leading-5 h-7 whitespace-nowrap px-3 py-[3px] w-fit hover:bg-active-gray rounded-sm border hover:border-border-active border-border-gray'><StackIcon size={24} />
							<div> Full Contract Details</div>
						</div>
					</a>
				</Link>
				{!unWatchable && account &&
				<button onClick={watchBounty} disabled={watchDisabled} className='flex items-center text-xs text-primary bg-inactive-gray leading-5 h-7 px-3 py-[3px] hover:bg-active-gray rounded-sm border hover:border-border-active border-border-gray'>
					{watchingDisplay  ?
						<svg xmlns="http://www.w3.org/2000/svg" 
							className={'stroke-muted inline-block mr-2 fill-muted'} 
							viewBox="0 0 16 16" width="16" height="16"><path fillRule="evenodd" d="M.143 2.31a.75.75 0 011.047-.167l14.5 10.5a.75.75 0 11-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.618 1.618 0 010-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 01.143 2.31zm3.386 3.378a14.21 14.21 0 00-1.85 2.244.12.12 0 00-.022.068c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 016.058 7.52l-2.53-1.832zM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 11-.473-1.423A6.23 6.23 0 018 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.619 1.619 0 010 1.798c-.11.166-.248.365-.41.587a.75.75 0 11-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 000-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5z">
							</path>
						</svg>:
						<svg xmlns="http://www.w3.org/2000/svg" 
							className={'stroke-muted inline-block mr-2 fill-muted'} viewBox="0 0 16 16" width="16" height="16"><path d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z">
							</path>
						</svg>			
					}
					<span>Watch</span>
				</button>}
				<div className='hidden lg:block'>
					<Image src={bounty.avatarUrl} className='rounded-full' alt="avatarUrl" width="51" height="51" />
				</div>
								
			</div> 
		</div>
	);
};
export default BountyModalHeading;