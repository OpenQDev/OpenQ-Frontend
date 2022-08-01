// Third party 
import React from 'react';
import Link from 'next/link';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import { PersonIcon, SignOutIcon } from '@primer/octicons-react';

const AccountModal = ({ chainId, account, ensName, deactivate, setIsConnecting, domRef, isSafeApp }) => {
	let networkName;
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
		<div className="flex flex-col items-center inline-block">
			<div className="flex -mt-2.5 md:-mt-0.5 border-b-gray-700 tooltip-triangle absolute"></div>
			<div className="flex z-40 -mt-2 md:mt-0 border-b-[#161B22] tooltip-triangle absolute"></div>

			<div ref={domRef} className='flex absolute flex-col z-30 bg-[#161B22] w-80 md:w-40 tooltip border-gray-700 border rounded-sm p-0'>
				<div className='flex text-[#c9d1d9] items-center w-full h-8 p-2 mt-8 md:mt-2 md:ml-2 m-4 md:m-0'>{networkName}</div>

				<div className="flex md:hover:bg-[#1f6feb] w-full h-8 gap-4 items-center hover:text-white text-[#c9d1d9] m-4 md:m-0">{/* <div ref={iconWrapper} className="border-4 rounded-full border-pink-500 w-min h-10"></div> */}
					<div className='flex w-full p-2 ml-2'>
						<span>{ensName}</span>
						<CopyAddressToClipboard data={account} clipping={[5, 38]} />
					</div>
				</div>

				{!isSafeApp && <div className="flex flex-col w-full">
					<button className='flex md:hover:bg-[#1f6feb] h-8 w-full items-center hover:text-white text-[#c9d1d9] self-start gap-4  p-2 m-4 md:m-0' onClick={disconnectAccount}>
						<SignOutIcon className='w-8 h-8 md:w-4 md:h-4 ml-2 ' />
						<span>Disconnect</span>
					</button>
					<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${account}`} onClick={disconnectAccount}>
						<a className='flex md:hover:bg-[#1f6feb] h-8 items-center w-full hover:text-white text-[#c9d1d9] self-start gap-4 p-2 mb-8 md:mb-2 m-4 md:m-0'>
							<PersonIcon className='w-8 h-8 md:w-4 md:h-4 ml-2' />
							<span>Profile</span>
						</a>
					</Link>
				</div>}
			</div>
		</div>
	);
};
export default AccountModal;