import React from 'react';
import { gnosisSafe, injected, walletconnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';

const ConnectModal = ({closeModal})=>{
	const {activate} = useWeb3();

	const handleMetaMask = async()=>{
		await activate(injected);
		closeModal();
	};

	const handleWalletConnect = async()=>{
		await activate( walletconnect);
		closeModal();
	};

	const handleGnosisSafe = async()=>{
		console.log	(	await activate(gnosisSafe));
	};
	
	return(
		<div>
			<div className='text-white absolute inset-0 flex justify-center items-center'>
				<div className='max-w-xl w-5/6 bg-dark-mode z-40  flex flex-col gap-4 p-6 text-lg items-center rounded-lg '>
					<button onClick={handleMetaMask} className=' border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent-inside hover:border-active-accent group-hover:bg-active-accent group-hover:border-active-accent'>
			Metamask
					</button>
					<button onClick={handleWalletConnect} className='border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent-inside hover:border-active-accent group-hover:border-active-accent'>
				WalletConnect
					</button>
					<button onClick={handleGnosisSafe} className='border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent-inside hover:border-active-accent group-hover:border-active-accent'>
				GnosisSafe
					</button>
					<button onClick={closeModal} className='border-2 border-inactive-accent rounded-full py-2 px-4 bg-inactive-accent-inside group-hover:bg-active-accent hover:border-active-accent group-hover:border-active-accent'>
					Back
					</button>
				</div>
			</div>
			<div onClick={closeModal} className='bg-overlay z-30 inset-0 absolute'></div>
		</div>

	);
};
export default ConnectModal;