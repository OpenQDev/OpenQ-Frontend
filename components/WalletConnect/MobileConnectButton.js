// Third Party
import React, { useState, useEffect, useRef } from 'react';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import { injected } from './connectors';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import AccountModal from './AccountModal';
import jazzicon from '@metamask/jazzicon';

const MobileConnectButton = () => {
	// State
	const [buttonText, setButtonText] = useState('Connect Wallet');
	const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true);
	const [showModal, setShowModal] = useState();
	const modalRef = useRef();
	const buttonRef = useRef();
	const iconWrapper = useRef();
	// Context
	const { chainId, account, activate, active, deactivate } = useWeb3();

	// Hooks
	useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

	useEffect(() => {
		setIsOnCorrectNetwork(
			chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['chainId'] ==
			chainId
		);
	}, [chainId]);

	useEffect(()=>{
		if(!active){setButtonText('Connect Wallet');}
	},[active]);

	useEffect(() => {
		if (account && iconWrapper.current) {
			iconWrapper.current.innerHTML = '';
			iconWrapper.current.appendChild(jazzicon(28, parseInt(account.slice(2, 10), 16)));
		}
	}, [account, isOnCorrectNetwork, buttonText]);
	
	useEffect(() => {
		let handler = (event) => {
			if (!modalRef.current?.contains(event.target)&&event.target!==buttonRef.current) {
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
		setButtonText('Connecting...');
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
	if (account && isOnCorrectNetwork&&buttonText!=='Connect Wallet') {
		// const firstThree = account.slice(0, 5);
		// const lastThree = account.slice(-3);
		return (
			<div className='h-7'>
				<button ref={buttonRef}
					onClick={()=>setShowModal(()=>!showModal)}>
					
					<div ref={iconWrapper}></div>
				</button>
				{(showModal)&&
				<AccountModal
					domRef={modalRef}
					account = {account} 
					chainId = {chainId} 
					deactivate={deactivate}
					setButtonText={setButtonText}/>}
			</div>
		);
	} else if (account&&buttonText!=='Connect Wallet') {
		return (
			<div>
				<button onClick={addOrSwitchNetwork}>					
					{buttonText}
				</button>
			</div>
		);
	} else {
		return (
			<div>
				<button
					className='text-pink-300 text-xs border border-pink-500 rounded-lg p-2'
					onClick={onClickConnect}>
					{buttonText}
				</button>
			</div>
		);
	}
};

export default MobileConnectButton;
