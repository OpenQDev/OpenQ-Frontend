// Third Party
import React from 'react';
// Custom
import Footer from './Footer';
import ProfilePicture from './ProfilePicture';
import ConnectButton from './WalletConnect/ConnectButton.js';

const Layout = ({ children }) => {
	return (
		<div>
			<div className="flex flex-fill pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
				<ProfilePicture />
				<ConnectButton />
			</div>
			{children}
			<Footer />
		</div >
	);
};

export default Layout;
