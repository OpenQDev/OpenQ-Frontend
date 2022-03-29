// Third Party
import React, { useState } from 'react';
// Custom
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import useCheckFirstLaunch from '../../hooks/useCheckFirstLaunch.js';

const Layout = ({ children }) => {
	const [sidebar, setSidebar] = useState(false);

	const [isFirstLaunch] = useCheckFirstLaunch();
	const [showBanner, updateShowBanner] = useState(true);
	return (
		<div>{showBanner && isFirstLaunch ?
			<div className="w-full bg-inactive-accent-inside border-inactive-accent border-b h-12 text-white grid grid-cols-wide content-center px-4">

				<div className='col-start-2 col-end-3 text-center'>Welcome to <span className='font-bold text-tinted'>OpenQ!</span> Since it{'\''}s your first time with us, check out our <a className='underline font-bold text-tinted' href="https://vimeo.com/677467068" target="_blank" rel="noreferrer">demo</a>.</div>
				<button onClick={() => updateShowBanner(false)} className='w-6  h-6 justify-self-end text-white cursor-pointer font-bold bg-inactive-accent hover:bg-active-accent rounded-md text-center'>{'\×'}</button>
			</div> : null}
		<div className="flex flex-row px-2">
			<Sidebar trigger={sidebar} setTrigger={setSidebar} />

			<div className="flex w-full flex-col sm:pt-5 justify-center">
				{/*  Mobile navbar triggered by tailwind */}
				<MobileSidebar trigger={setSidebar} />

				<div className="flex justify-end invisible md:visible">
					{/* 	Profile and login components */}
					<div className="flex flex-row items-center pr-5">
						<div className="pr-5">
							<ConnectButton />
						</div>
						<div className="w-8">
							<ProfilePicture />
						</div>
					</div>
				</div>
				<div
					className={`pt-18 justify-center ${sidebar ? 'opacity-20' : null
					}`}
				>
					{children}
				</div>
			</div>
		</div>
		</div>
	);
};

export default Layout;
