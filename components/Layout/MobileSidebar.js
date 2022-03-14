// Third Party
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Custom
import MobileConnectButton from '../WalletConnect/MobileConnectButton.js';
import ProfilePicture from './ProfilePicture.js';

const MobileSidebar = () => {
	return (
		<div className="flex justify-between items-center gap-2 w-full max-h-12 md:hidden pr-5 py-2 bg-black">
			
			{/* <div className="text-white text-lg font-bold font-mont">OpenQ</div> */}

			<div className="pl-5">
				<Link href="/">
					<div className="flex flex-row space-x-4">
						<Image src="/openq-logo.png" alt="OpenQ" width="31" height="31" />
					</div>
				</Link>
			</div>

			<div className="flex flex-row space-x-4 items-center">
				<MobileConnectButton />
				<div className="w-8 h-8">
					<ProfilePicture />
				</div>
			</div>
		</div>
	);
};

export default MobileSidebar;
