// Third Party
import React from 'react';
// Custom
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import MintBountyButton from '../MintBounty/MintBountyButton';
import Navbar from '../Layout/Navbar';

const Layout = ({ children }) => {
	return (
		<div>
			<Navbar>
				<div className="flex flex-grow pl-12 pt-5 pr-12 pb-5 border-b items-center justify-between">
					<MintBountyButton />
					<ProfilePicture />
					<ConnectButton />
				</div>
				{children}
			</Navbar>
		</div>
	);
};

export default Layout;
