// Third Party
import React from 'react';
// Custom
import ConnectButton from './WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import MintBountyButton from './MintBountyButton';

const Layout = ({ children }) => {
	return (
		<div>
			<div className="flex flex-grow pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
				<div className="font-bold text-xl font-mont text-gray-800">OpenQ</div>
				<MintBountyButton />
				<ProfilePicture />
				<ConnectButton />
			</div>
			{children}
			{/* 	<Footer /> */}
		</div>
	);
};

export default Layout;
