// Third party
import React, { useState, useEffect, useContext } from 'react';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import axios from 'axios';
// Custom
import StoreContext from '../../store/Store/StoreContext.js';
import ConnectButton from '../WalletConnect/ConnectButton.js';
import ProfilePicture from './ProfilePicture.js';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import FirstTimeBanner from '../Layout/FirstTimeBanner';
import Footer from './Footer.js';
import useWeb3 from '../../hooks/useWeb3.js';

const Layout = ({ children }) => {
	const [gnosisSafe, setGnosisSafe] = useState();
	const [safeInfo, setSafeInfo] = useState();
	const { account, activate, deactivate } = useWeb3();
	const [appState] = useContext(StoreContext);
	useEffect(async () => {
		//const openQPrismaClient = new WrappedOpenQPrismaClient();
		const safe = new SafeAppConnector();
		safe.getSafeInfo().then((data) => {
			if (data) {
				setSafeInfo(data);
				deactivate();
			}
		});
		setGnosisSafe(safe);

		// First tokens + matic
		const GET_PRICES = {
			'query': `{
			prices {
    				timestamp
    				priceObj
  			
			}
		}`};
		let tokenPrices = {};

		try{
			if(process.env.NEXT_PUBLIC_DEPLOY_ENV==='local'){
				const response = await axios.get(`${process.env.NEXT_PUBLIC_OPENQ_API_URL}/prices`);
				tokenPrices = response.data[0].priceObj;
			}
			else{
				const response = await axios({
					url: process.env.NEXT_PUBLIC_OPENQ_API_URL,
					method: 'post',
					headers: {'content-type':'application/json'},
					data: GET_PRICES
				});
				tokenPrices = response?.data?.data?.prices?.priceObj ||{};
			}
		}
		catch(err){
			console.log('could not fetch initial prices', err);
		}
		
		appState.tokenClient.firstTenPrices = tokenPrices;
	}, []);


	useEffect(async () => {
		if (safeInfo) {
			await activate(gnosisSafe);
		}
	}, [account]);
	const [sidebar, setSidebar] = useState(false);

	return (
		<div className='min-h-screen relative'>
			<FirstTimeBanner />
			<div className="flex flex-row pb-56">
				<Sidebar trigger={sidebar} setTrigger={setSidebar} />

				<div className="flex w-full flex-col md:pt-5 justify-center">
					{/*  Mobile navbar triggered by tailwind */}
					<MobileSidebar trigger={setSidebar} />

					<div className="flex justify-end invisible md:visible">
						{/* 	Profile and login components */}
						<div className="flex flex-row items-center pr-12">
							<div className="pr-5">
								<ConnectButton />
							</div>
							<div>
								<ProfilePicture />
							</div>
						</div>
					</div>
					<div
						className={`pt-18 justify-center sm:px-4 md:pl-24 ${sidebar ? 'opacity-20' : null
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
