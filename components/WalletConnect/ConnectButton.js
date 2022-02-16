// Third Party
import React, { useState, useEffect, useRef } from 'react';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import { injected } from './connectors';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import jazzicon from '@metamask/jazzicon';

const ConnectButton = () => {
	// State
	const [buttonText, setButtonText] = useState('Connect Wallet');
	const [isDisabled, setIsDisabled] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);
	const iconWrapper = useRef();

	// Context
	const { chainId, account, activate, active } = useWeb3();

	// Hooks
	useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

	useEffect(() => {
		if (active) {
			setIsHidden(true);
		}
	}, [active]);

	useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(24, parseInt(account.slice(2, 10), 16)));
		}
	}, [account, isOnCorrectNetwork]);
	
	useEffect(() => {
		setIsOnCorrectNetwork(
			chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'] ==
        chainId
		);
	}, [chainId]);

	// Methods
	const onClickConnect = async () => {
		setButtonText('Connecting...');
		setIsDisabled(true);

		await activate(injected);

		setIsDisabled(false);
		setIsHidden(true);
	};

	const addOrSwitchNetwork = () => {
		window.ethereum
			.request({
				method: 'wallet_addEthereumChain',
				params:
          chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['params'],
			})
			.catch((error) => console.log('Error', error.message));
	};

	// Render
	if (account && isOnCorrectNetwork) {
		const firstThree = account.slice(0, 5);
		const lastThree = account.slice(-3);
		return (
			<div>
				<button
					disabled={true}
					className="group flex gap-x-3 font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
				>
					<span className="border-2 border-pink-500 rounded-full leading-3 group-hover:border-pink-300" ref={iconWrapper}></span>
					{firstThree}...{lastThree}
				</button>
			</div>
		);
	} else if (account) {
		return (
			<div>
				<button
					onClick={addOrSwitchNetwork}
					className="font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
				>
          Use{' '}
					{
						chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV][
							'networkName'
						]
					}{' '}
          Network
				</button>
			</div>
		);
	} else {
		return (
			<div>
				<button
					hidden={isHidden}
					disabled={isDisabled}
					onClick={onClickConnect}
					className="font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
				>
					{buttonText}
				</button>
			</div>
		);
	}
};

export default ConnectButton;
