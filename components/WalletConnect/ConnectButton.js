// Third party
import React, { useState, useEffect, useRef } from 'react';
import jazzicon from '@metamask/jazzicon';
// Custom
import useWeb3 from '../../hooks/useWeb3';
import useConnectOnLoad from '../../hooks/useConnectOnLoad';
import chainIdDeployEnvMap from './chainIdDeployEnvMap';
import AccountModal from './AccountModal';
import ConnectModal from './ConnectModal';
import useEns from '../../hooks/useENS';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import axios from 'axios';

const ConnectButton = () => {
	// State
	const [isConnecting, setIsConnecting] = useState(false);
	const [showConnectModal, setShowConnectModal] = useState(false);
	const { chainId, error, account, deactivate, safe } = useWeb3();
	const [isOnCorrectNetwork, ] = useIsOnCorrectNetwork( { chainId:chainId, error: error, account: account });
	const [showModal, setShowModal] = useState();
	const iconWrapper = useRef();
	const modalRef = useRef();
	const buttonRef = useRef();

	// Context
	const [ensName] = useEns(account);
	// Hooks
	useConnectOnLoad()(); // See [useEagerConnect](../../hooks/useEagerConnect.js)

	useEffect(async () => {
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
		setShowConnectModal(true);
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


	const signMessage = () => {
		const message = 'OpenQ';
		window.ethereum
			.request({
				method: 'personal_sign',
				params: [message, account]
			}).then((signature) => {
				axios.get('http://localhost:3001/verifySignature', {
					params: {
						signature, account
					}
				})
			})
			.catch((error) => console.log('Error', error.message));
	}

	// Render
	return (<div>
		{	account && isOnCorrectNetwork ?
			<div>
				<button
					disabled={isConnecting}
					ref={buttonRef}
					onClick={() => { setShowModal(!showModal); }}
					className="group flex items-center gap-x-3 h-12 font-mont whitespace-nowrap rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2 px-6  font-semibold cursor-pointer hover:border-active-accent"
				>
					<span className="border-2 border-inactive-accent rounded-full h-7 py-px bg-inactive-accent group-hover:bg-active-accent group-hover:border-active-accent" ref={iconWrapper}></span>
					<span className='py'>{ensName|| `${account.slice(0, 5)}...${account.slice(-3)}`}</span>
				</button>

				<button
					className="group flex items-center gap-x-3 h-12 font-mont whitespace-nowrap rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2 px-6  font-semibold cursor-pointer hover:border-active-accent"
					onClick={signMessage}
				>
					Sign Message
				</button>

				{showModal&&
				<AccountModal
					domRef={modalRef}
					account = {account}
					ensName = {ensName}
					chainId = {chainId} 
					deactivate={deactivate}
					setIsConnecting={setIsConnecting}
					isSafeApp = {safe}/>}
			</div>:
			isOnCorrectNetwork?
				<div>
					<button
						onClick={onClickConnect}
						className="flex items-center font-mont whitespace-nowrap h-12 rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2 px-6 text-white font-semibold cursor-pointer hover:border-active-accent"
						disabled={isConnecting}
					>
						{'Connect Wallet'}
					</button>
				</div>:
				<button onClick={addOrSwitchNetwork}
					className="flex items-center font-mont whitespace-nowrap h-12 rounded-lg border border-inactive-accent bg-inactive-accent-inside py-2.5 px-6 text-white font-semibold"
				>
					Use{' '}
					{
						chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV][
							'networkName'
						]
					}{' '}
					Network
				</button>
		}
		{
			showConnectModal && <ConnectModal closeModal={()=>setShowConnectModal(false)} />
		}	
	</div>
	);
};


export default ConnectButton;
