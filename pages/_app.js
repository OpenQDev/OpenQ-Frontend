// Third Party Libraries
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import 'tailwindcss/tailwind.css';
import { SkeletonTheme } from 'react-loading-skeleton';

// Custom
import '../styles/globals.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Layout from '../components/Layout/Layout';

function OpenQ({ Component, pageProps }) {
	function getLibrary(provider) {
		const library = new ethers.providers.Web3Provider(provider);
		library.pollingInterval = 12000;
		return library;
	}

	return (
		<div className="bg-dark-mode min-h-screen">
			<AuthProvider>
				<StoreProvider>
					<Web3ReactProvider getLibrary={getLibrary}>
						<Layout>
							<SkeletonTheme baseColor="#333" borderRadius={'1rem'} height={'16px'} >
								<Component {...pageProps} />
							</SkeletonTheme>
						</Layout>
					</Web3ReactProvider>
				</StoreProvider>
			</AuthProvider>
		</div>
	);
}

export default OpenQ;
