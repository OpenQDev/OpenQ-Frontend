import React from 'react';
import { injected, walletconnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';

const ConnectModal = ({closeModal})=>{
	const {activate} = useWeb3();

	const handleMetaMask = async()=>{
		await activate(injected);
	};

	const handleWalletConnect = async()=>{
		await activate( walletconnect);
	};
	return(<div>
		<div className='text-white absolute inset-0 z-40 flex justify-center items-center'>
			<div className='max-w-xl w-5/6 bg-dark-mode flex flex-col gap-4 p-6 text-3xl items-center rounded-lg '>
				<button onClick={handleMetaMask} className=' border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent group-hover:bg-active-accent group-hover:border-active-accent'>
			Metamask
				</button>
				<button onClick={handleWalletConnect} className='border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent group-hover:bg-active-accent group-hover:border-active-accent'>
				WalletConnect
				</button>
				<button onClick={closeModal} className='border-2 border-inactive-accent rounded-full py-2 px-4 bg-black group-hover:bg-active-accent group-hover:border-active-accent'>
					Back
				</button>
			</div>
		</div>
		<div className='bg-overlay z-30 inset-0 absolute'></div>
	</div>

	);
};
export default ConnectModal;