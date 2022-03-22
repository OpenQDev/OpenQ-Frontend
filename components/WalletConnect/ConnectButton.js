// Third Party
import React, { useState, useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import { injected } from './connectors';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import AccountModal from './AccountModal';
import useEns from '../../hooks/useENS';

const ConnectButton = () => {
	// State
	const [isConnecting, setIsConnecting] = useState(false);
	const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);
	const [showModal, setShowModal] = useState();
	const iconWrapper = useRef();
	const modalRef = useRef();
	const buttonRef = useRef();

	// Context
	const { chainId, account, activate, deactivate } = useWeb3();
	const [accountName] = useEns(account);
	// Hooks
	useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

	useEffect(async() => {
		if(!account){
			setIsConnecting(false);
		}
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

	useEffect(() => {
		let handler = (event) => {
			if (!modalRef.current?.contains(event.target)&&!buttonRef.current?.contains(event.target)) {
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
					ref= {buttonRef}
					onClick={()=>{setShowModal(!showModal);}}
					className="group flex gap-x-3 font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
				>
					<span className="border-2 border-pink-500 rounded-full leading-3 group-hover:border-pink-300" ref={iconWrapper}></span>
					<span className='py'>	{accountName < 15 ? accountName: `${firstThree}...${lastThree}`}</span>
				</button>
				{showModal&&
				<AccountModal
					domRef={modalRef}
					account = {account}
					accountName = {accountName}
					chainId = {chainId} 
					deactivate={deactivate}
					setIsConnecting={setIsConnecting}/>}
			</div>
		);
	} else if (account) {
		return (
			<div>
				<button
					onClick={addOrSwitchNetwork}
					className="font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2.5 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
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
					className="font-mont whitespace-nowrap rounded-lg border border-pink-500 bg-pink-700 bg-opacity-20 py-2.5 px-6 text-white font-semibold cursor-pointer hover:border-pink-300"
				>
					{isConnecting? 'Connecting...': 'Connect Wallet'}
				</button>
			</div>
		);
	}
};

export default ConnectButton;
