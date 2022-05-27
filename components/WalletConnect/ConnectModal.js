import React, {  useEffect } from 'react';
import { injected, walletconnect } from './connectors';
import useWeb3 from '../../hooks/useWeb3';
import Image from 'next/image';

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
				<div className='max-w-md w-5/6 bg-dark-mode z-40  flex flex-col gap-2 p-6 px-12 text-lg rounded-lg '>
					<div>
						<Image alt={'openq-logo'} src={'/openq-logo.png'} height={32} width={32}/>
					</div>
					<h2 className='text-xl font-bold'>Connect Wallet</h2>
					<p className='text-sm'>Connect your wallet to continue with OpenQ. By connecting your wallet you agree with OpenQ{'\''}s terms of service.</p>
					<button onClick={handleMetaMask} className='flex p-2 mt-4  my-2 w-full gap-4 hover:bg-inactive-accent/10 rounded-md hover:border-web-gray border border-transparent justify-center'>
						<Image src={'/wallet-logos/metamask.png'} height={40} width={40} alt={'metamask logo'}/>
						<div className='text-xl leading-loose'>
							Metamask
						</div>
					</button>
					<button onClick={handleWalletConnect} className='flex p-2 mb-4 w-full gap-4 hover:bg-inactive-accent/10 rounded-md hover:border-web-gray border border-transparent justify-center'>
						<Image src={'/wallet-logos/wallet-connect.jpg'} className="rounded-full" height={40} width={40} alt={'wallet connect logo'}/>
						<div className='leading-loose text-xl'>
							WalletConnect
						</div>
					</button>
					<button onClick={closeModal} className='self-center border border-inactive-accent font-semibold w-32 rounded-full py-1 px-2 bg-inactive-accent-inside group-hover:bg-active-accent hover:border-active-accent group-hover:border-active-accent'>
							Close
					</button>
				</div>
			</div>
			<div onClick={closeModal} className='bg-overlay z-30 top-0 left-0 right-0 h-screen absolute'></div>
		</div>

	);
};
export default ConnectModal;