// Third party
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Custom
import MobileConnectButton from '../WalletConnect/MobileConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import StoreContext from '../../store/Store/StoreContext.js';

const MobileSidebar = () => {

	const [appState] = useContext(StoreContext);

	return (
		<div className="flex justify-between items-center gap-2 w-full max-h-12 md:hidden pr-4 py-8 bg-black">
			{appState.needsReload ?
				<a href="/">
					<div className="flex pl-5">
						<Image
							src="/openq-logo.png"
							alt="OpenQ"
							width="32"
							height="32"
						/>
						</div>
				</a> :
				<Link href={'/'}>
					<a>
						<div className="flex pl-5">
							<Image
								src="/openq-logo.png"
								alt="OpenQ"
								width="32"
								height="32"
							/>
						</div>
					</a>
				</Link>}

			<div className="flex flex-row space-x-4 items-center">
				<MobileConnectButton />
				<ProfilePicture mobile={true} />
			</div>
		</div>
	);
};

export default MobileSidebar;
