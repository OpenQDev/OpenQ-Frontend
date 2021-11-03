import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Layout from '../components/Layout';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';

function MyApp({ Component, pageProps }) {

	function getLibrary(provider) {
		const library = new ethers.providers.Web3Provider(provider);
		library.pollingInterval = 12000;
		return library;
	}

	return (
		<AuthProvider>
			<StoreProvider>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</Web3ReactProvider>
			</StoreProvider>
		</AuthProvider>
	);
}

export default MyApp;
