// Third Party 
import React, { useRef, useEffect } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';

const AccountModal = ({ chainId, account, ensName, deactivate, setIsConnecting, domRef }) => {
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

	useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(32, parseInt(account.slice(2, 10), 16)));
		}
	}, [account]);

	return (
		<div ref={domRef} className='flex flex-col z-20 gap-4 bg-dark-mode text-white w-60 absolute top-14 md:top-20 right-2 sm:right-20 border-web-gray border rounded-md p-4'>
			<div className="flex gap-4 items-center"><div ref={iconWrapper} className="border-4 rounded-full border-pink-500 w-min h-10"></div>
				<div>
					<span>{ensName}</span>
					<CopyAddressToClipboard data={account} clipping={[5, 38]} />
				</div>
			</div>
			<div className='font-semibold'>{networkName}</div>
			<button className='rounded-lg border border-web-gray w-min p-2 text-xs font-semibold text-white/80 hover:text-white hover:border-white/80 self-end' onClick={disconnectAccount}>Disconnect</button>
		</div>
	);
};
export default AccountModal;