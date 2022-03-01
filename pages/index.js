// Third Party
import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';

// Custom
import BountyHomepage from '../components/Bounty/BountyHomepage';
import OrganizationHomepage from '../components/Organization/OrganizationHomepage';
import StoreContext from '../store/Store/StoreContext';
import useCheckFirstLaunch from '../hooks/useCheckFirstLaunch';

export default function Index() {
	const [internalMenu, setInternalMenu] = useState('issue');
	const [appState] = useContext(StoreContext);

	// This is a custom hook that should run once on startup
	// the isFirstLaunch state should be used to toggle display:none on a thin top banner inviting user to watch demo
	// For some reason it keeps getting rendered and run twice, resulting in isFirstLaunch always being true
	const [isFirstLaunch] = useCheckFirstLaunch();

	return (
		<div>
			<Head>
				<title>OpenQ</title>
				<meta
					name="OpenQ Bounties"
					content="width=device-width, initial-scale=1.0"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="bg-dark-mode pt-10 flex-col">
					<div className="flex justify-center pb-8">
						<div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
							<button
								onClick={() => setInternalMenu('org')}
								className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${internalMenu == 'org' ? 'bg-gray-500' : null
									}`}
							>
								Organizations
							</button>
							<button
								onClick={() => setInternalMenu('issue')}
								className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${internalMenu == 'issue' ? 'bg-gray-500' : null
									}`}
							>
								Issues
							</button>
						</div>
					</div>
					<div className="px-5 md:px-14">
						{internalMenu == 'org' ? <OrganizationHomepage /> : <BountyHomepage />}
					</div>
				</div>
			</main>
		</div>
	);
}
