// Third party
import React, { useState, useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import { injected } from './connectors';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import AccountModal from './AccountModal';
import useEns from '../../hooks/useENS';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const ConnectButton = () => {
	// State
	const [isConnecting, setIsConnecting] = useState(false);
	const [isOnCorrectNetwork,] = useIsOnCorrectNetwork();
	const [showModal, setShowModal] = useState();
	const iconWrapper = useRef();
	const modalRef = useRef();
	const buttonRef = useRef();

	// Context
	const { chainId, account, activate, deactivate } = useWeb3();
	const [ensName] = useEns(account);
	// Hooks
	useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

	useEffect(async () => {
		if (!account) {
			setIsConnecting(false);
		}
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(24, parseInt(account.slice(2, 10), 16)));
		}
	}, [account, isOnCorrectNetwork]);

	useEffect(() => {
		let handler = (event) => {
			if (!modalRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
				setShowModal(false);
			}
		};
		window.addEventListener('mousedown', handler);

		return () => {
			window.removeEventListener('mousedown', handler);
		};
	});

	// Methods
	const onClickConnect = async () => {
		setIsConnecting(true);
		await activate(injected);
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
					ref={buttonRef}
					onClick={() => { setShowModal(!showModal); }}
					className="group flex items-center gap-x-3 h-12 font-mont whitespace-nowrap rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2 px-6 text-white font-semibold cursor-pointer hover:border-active-accent"
				>
					<span className="border-2 border-inactive-accent rounded-full h-7 py-px bg-inactive-accent group-hover:bg-active-accent group-hover:border-active-accent" ref={iconWrapper}></span>
					<span className='py'>{ensName || `${firstThree}...${lastThree}`}</span>
				</button>
				{showModal &&
					<AccountModal
						domRef={modalRef}
						account={account}
						ensName={ensName}
						chainId={chainId}
						deactivate={deactivate}
						setIsConnecting={setIsConnecting} />}
			</div>
		);
	} else if (account) {
		return (
			<div>
				<button
					onClick={addOrSwitchNetwork}
					className="flex items-center font-mont whitespace-nowrap h-12 rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2.5 px-6 text-white font-semibold cursor-pointer hover:border-active-accent"
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
					onClick={onClickConnect}
					className="flex items-center font-mont whitespace-nowrap h-12 rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2 px-6 text-white font-semibold cursor-pointer hover:border-active-accent"
				>
					{isConnecting ? 'Connecting...' : 'Connect Wallet'}
				</button>
			</div>
		);
	}
};

export default ConnectButton;
