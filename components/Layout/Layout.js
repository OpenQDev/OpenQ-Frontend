// Third Party
import React, { useState } from 'react';
// Custom
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import useCheckFirstLaunch from '../../hooks/useCheckFirstLaunch.js';
import Footer from './Footer.js';

const Layout = ({ children }) => {
	const [sidebar, setSidebar] = useState(false);

	const [isFirstLaunch] = useCheckFirstLaunch();
	const [showBanner, updateShowBanner] = useState(true);
	return (
		<div className='min-h-screen relative'>{showBanner && isFirstLaunch ?
			<div className="w-full bg-inactive-accent-inside border-inactive-accent border-b text-white grid grid-cols-[1fr_1fr_1fr] content-center py-4 items-center px-4 pr-8">

				<div className='col-start-2 col-end-3 text-center min-w-[300px]'>Welcome to <span className='font-bold text-tinted'>OpenQ!</span> Since it{'\''}s your first time with us, check out our <a className='underline font-bold text-tinted' href="https://vimeo.com/677467068" target="_blank" rel="noreferrer">demo</a>.</div>
				<button onClick={() => updateShowBanner(false)} className='w-6 h-6 justify-self-end text-white cursor-pointer font-bold bg-inactive-accent hover:bg-active-accent rounded-md text-center'>{'\×'}</button>
			</div> : null}
		<div className="flex flex-row pb-40">
			<Sidebar trigger={sidebar} setTrigger={setSidebar} />

			<div className="flex w-full flex-col md:pt-5 justify-center">
				{/*  Mobile navbar triggered by tailwind */}
				<MobileSidebar trigger={setSidebar} />

				<div className="flex justify-end invisible md:visible">
					{/* 	Profile and login components */}
					<div className="flex flex-row items-center pr-5">
						<div className="pr-5">
							<ConnectButton />
						</div>
						<div>
							<ProfilePicture />
						</div>
					</div>
				</div>
				<div
					className={`pt-18 justify-center md:pl-20 lg:pl-0 ${sidebar ? 'opacity-20' : null
					}`}
				>
					{children}
				</div>
			</div>
		</div>
		<Footer />
		</div>
	);
};

export default Layout;
