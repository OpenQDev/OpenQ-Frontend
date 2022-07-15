// Third party Libraries
import React, { useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import 'tailwindcss/tailwind.css';
import 'github-markdown-css/github-markdown-dark.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import Script from 'next/script';

// Custom
import '../styles/globals.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Layout from '../components/Layout/Layout';
import Head from 'next/head';
import {useRouter} from 'next/router';

function OpenQ({ Component, pageProps }) {
	function getLibrary(provider) {
		const library = new ethers.providers.Web3Provider(provider);
		library.pollingInterval = 12000;
		return library;
	}


	const router = useRouter();
	useEffect(() => {

		const pageview = (url) => {
			if(window.gtag){
				window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
					page_path: url,
				});
			}
		};

		const handleRouteChange = (url) => {
			pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);


	return (
		<div className="bg-dark-mode min-h-screen text-white">
			{/* Global Site Tag (gtag.js) - Google Analytics */}
			<Script
				strategy="lazyOnload"
				src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
			/>

			<Script strategy="lazyOnload">
				{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
  `}
			</Script>
			<Head>
				<title>OpenQ</title>
				<meta
					name="OpenQ Bounties"
					content="width=device-width, initial-scale=1.0"
				/>
				<link rel="icon" href="/openq-logo.png" />
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<>

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
			</>
		</div>
	);
}

export default OpenQ;
