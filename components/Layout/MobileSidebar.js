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
		<div className="flex justify-between items-center gap-2 w-full max-h-12 md:hidden pr-5 py-2 bg-black">
			<div className="pl-5">{appState.needsReload ?
				<a href="/">
					<Image
						src="/openq-logo.png"
						alt="OpenQ"
						width="31"
						height="31"
					/>
				</a> :
				<Link href={'/'}>
					<a>
						<Image
							src="/openq-logo.png"
							alt="OpenQ"
							width="31"
							height="31"
						/>
					</a>
				</Link>}
			</div>

			<div className="flex flex-row space-x-4 items-center">
				<MobileConnectButton />
				<ProfilePicture mobile={true} />
			</div>
		</div>
	);
};

export default MobileSidebar;
