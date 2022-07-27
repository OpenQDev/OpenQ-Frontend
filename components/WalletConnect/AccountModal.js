// Third party 
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import Link from 'next/link';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const AccountModal = ({ chainId, account, ensName, deactivate, setIsConnecting, domRef, isSafeApp }) => {
	let networkName;
	const iconWrapper = useRef();
	for (let key in chainIdDeployEnvMap) {
		if (chainIdDeployEnvMap[key].chainId === chainId) {
			networkName = chainIdDeployEnvMap[key].networkName;
		}
	}
	const disconnectAccount = () => {
		try {
			deactivate();
		}
		catch (ex) {
			console.log(ex);
		}
		setIsConnecting(false);
	};

	{/* useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]); */}

	return (
		<div class="flex flex-col items-center inline-block">
			<div class="flex mt-0.5 md:mt-0.5 border-b-gray-700 tooltip-triangle absolute"></div>
			<div class="flex z-40 mt-1 border-b-[#161B22] tooltip-triangle absolute"></div>

			<div ref={domRef} className='flex absolute flex-col z-30 gap-2 bg-[#161B22] w-64 md:w-48 tooltip right-30 border-gray-700 border rounded-sm p-4'>
				<div className="flex gap-4 items-center">{/* <div ref={iconWrapper} className="border-4 rounded-full border-pink-500 w-min h-10"></div> */}
					<div>
						<span>{ensName}</span>
						<CopyAddressToClipboard data={account} clipping={[5, 38]} />
					</div>
				</div>
				<div className='font-semibold flex'>{networkName}</div>
				{!isSafeApp && <div>
					<button className='flex w-min text-sm font-semibold hover:text-tinted self-start gap-1' onClick={disconnectAccount}>

						<svg width="16" height="22" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect x="2" y="0.5" width="7" height="11" rx="2" fill="black" stroke="white" />
							<path d="M15.3536 6.35355C15.5488 6.15829 15.5488 5.84171 15.3536 5.64645L12.1716 2.46447C11.9763 2.2692 11.6597 2.2692 11.4645 2.46447C11.2692 2.65973 11.2692 2.97631 11.4645 3.17157L14.2929 6L11.4645 8.82843C11.2692 9.02369 11.2692 9.34027 11.4645 9.53553C11.6597 9.7308 11.9763 9.7308 12.1716 9.53553L15.3536 6.35355ZM5 6.5L15 6.5V5.5L5 5.5V6.5Z" fill="white" />
						</svg>

						<span>Disconnect</span>
					</button>
					<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${account}`} onClick={disconnectAccount}>
						<a className='flex w-min text-sm font-semibold hover:text-tinted self-start gap-1'>
							<svg xmlns="http://www.w3.org/2000/svg" height="22" width="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
								<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>

							<span>Profile</span>
						</a>
					</Link></div>}
			</div>
		</div>
	);
};
export default AccountModal;