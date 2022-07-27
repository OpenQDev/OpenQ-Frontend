// Third party 
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
import Link from 'next/link';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import { PersonIcon, SignOutIcon } from '@primer/octicons-react';

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
			<div class="flex -mt-2.5 md:-mt-0.5 border-b-gray-700 tooltip-triangle absolute"></div>
			<div class="flex z-40 -mt-2 md:mt-0 border-b-[#161B22] tooltip-triangle absolute"></div>

			<div ref={domRef} className='flex absolute flex-col z-30 gap-4 bg-[#161B22] w-80 md:w-40 tooltip  border-gray-700 border rounded-sm p-8 md:p-4'>
				<div className="flex gap-4 items-center">{/* <div ref={iconWrapper} className="border-4 rounded-full border-pink-500 w-min h-10"></div> */}
					<div>
						<span>{ensName}</span>
						<CopyAddressToClipboard data={account} clipping={[5, 38]} />
					</div>
				</div>
				<div className='flex'>{networkName}</div>
				{!isSafeApp && <div className="flex flex-col gap-4">
					<button className='flex items-center w-min hover:text-tinted self-start gap-2' onClick={disconnectAccount}>
							<SignOutIcon className='w-8 h-8 md:w-4 md:h-4' />
						<span>Disconnect</span>
					</button>
					<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${account}`} onClick={disconnectAccount}>
						<a className='flex items-center w-min hover:text-tinted self-start gap-2'>
							<PersonIcon className='w-8 h-8 md:w-4 md:h-4' />
							<span>Profile</span>
						</a>
					</Link>
					</div>}
			</div>
		</div>
	);
};
export default AccountModal;