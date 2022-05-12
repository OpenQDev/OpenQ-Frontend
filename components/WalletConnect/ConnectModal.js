import React, {  useEffect } from 'react';
import { injected, walletconnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';

const ConnectModal = ({closeModal})=>{

	const {activate, account} = useWeb3();

	const handleMetaMask = async()=>{
		await activate(injected);
		closeModal();
	};

	const handleWalletConnect = async()=>{
		await activate( walletconnect);
		closeModal();
	};
	useEffect(()=>{
		if(account){
			closeModal();
		}
	})
	,[account];
	return(
		<div>
			<div className='text-white absolute top-0 left-0 right-0 h-screen flex justify-center items-center'>
				<div className='max-w-xl w-5/6 bg-dark-mode z-40  flex flex-col gap-4 p-6 text-lg items-center rounded-lg '>
					<button onClick={handleMetaMask} className=' border-2 border-inactive-accent w-64 rounded-full py-2 px-4 bg-inactive-accent-inside hover:border-active-accent group-hover:bg-active-accent group-hover:border-active-accent'>
			Metamask
					</button>
					<button onClick={handleWalletConnect} className='border-2 border-inactive-accent w-64 rounded-full py-2 px-4 bg-inactive-accent-inside hover:border-active-accent group-hover:border-active-accent'>
				WalletConnect
					</button>
					<button onClick={closeModal} className='border-2 border-inactive-accent w-32 rounded-full py-2 px-4 bg-inactive-accent-inside group-hover:bg-active-accent hover:border-active-accent group-hover:border-active-accent'>
					Back
					</button>
				</div>
			</div>
			<div onClick={closeModal} className='bg-overlay z-30 top-0 left-0 right-0 h-screen absolute'></div>
		</div>

	);
};
export default ConnectModal;