// Third party Libraries
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/UserContext';
import { Web3ReactProvider } from '@web3-react/core';
import 'tailwindcss/tailwind.css';
import 'github-markdown-css/github-markdown-dark.css';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import ErrorBoundary from '../components/Layout/ErrorBoundary';

// Custom
import SetContextState from '../store/SetContextState/SetContextState';
import '../styles/globals.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Navigation from '../components/Layout/Navigation';
import Head from 'next/head';
import Footer from '../components/Layout/Footer';
import {
  walletConnect,
  walletConnectHooks,
  metaMask,
  metaMaskHooks,
  coinbaseWallet,
  coinbaseHooks,
} from '../components/WalletConnect/connectors';
import Script from 'next/script';
import FirstTimeBanner from '../components/Layout/FirstTimeBanner';

function OpenQ({ Component, pageProps }) {
  const connectors = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [coinbaseWallet, coinbaseHooks],
  ];

  const [user, setUser] = useState();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
    }

    const hjid = '3177116';
    const hjsv = '6';
    hotjar.initialize(hjid, hjsv);

    // Identify the user
    hotjar.identify('USER_ID', { userProperty: 'value' });

    // Add an event
    hotjar.event('button-click');

    // Update SPA state
    hotjar.stateChange('/my/page');

    // Check if Hotjar has been initialized before calling its methods
    if (hotjar.initialized()) {
      hotjar.identify('USER_ID', { userProperty: 'value' });
    }
  }, []);

  const router = useRouter();
  const route = router.pathname;
  const whiteBgRoutes = ['/drm', '/marketplace', '/hackathon-launchpad'];
  const isWhiteBgRoute = whiteBgRoutes.includes(route);
  const socialImage = pageProps?.page?.data?.socialimage.url;
  const title = pageProps?.page?.data?.slices[0]?.primary?.header[0]?.text;
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}

      <Head>
        <title>{title ?? 'OpenQ | Building powerful infrastructure around developers hubs'}</title>
        <meta name='OpenQ Bounties' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/openq-logo.png' />
        <link rel='manifest' href='/manifest.json' crossOrigin='use-credentials' />

        {socialImage && (
          <>
            <meta name='title' content={title ?? 'OpenQ | Building powerful infrastructure around developers hubs'} />
            <meta
              name='description'
              content='With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!'
            />
            <meta property='twitter:site' content='@openqlabs'></meta>{' '}
            <meta
              property='twitter:title'
              content={title ?? 'OpenQ | Building powerful infrastructure around developers hubs'}
            />
            <meta property='twitter:description' content='A CRM by DevRels for DevRels' />
            <meta property='twitter:card' content='summary_large_image' />
            <meta property='twitter:image' content={socialImage} />
            <meta property='twitter:url' content='https://openq.dev/blog/drm-launch' />
            <meta
              name='og:title'
              content={title ?? 'OpenQ | Building powerful infrastructure around developers hubs'}
            />
            <meta property='og:description' content='A CRM by DevRels for DevRels' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://openq.dev/blog/drm-launch'></meta>
            <meta property='og:image' content={socialImage} />
          </>
        )}
      </Head>
      <Script id='live-session'>
        {`window['__ls_namespace'] = 'LiveSession';
    window['__ls_script_url'] = 'https://cdn.livesession.io/track.js';
    !function(w, d, t, u, n) {
          if (n in w) {if(w.console && w.console.log) { w.console.log('LiveSession namespace conflict. Please set window["__ls_namespace"].');} return;}
          if (w[n]) return; var f = w[n] = function() { f.push ? f.push.apply(f, arguments) : f.store.push(arguments)};
          if (!w[n]) w[n] = f; f.store = []; f.v = "1.1";
  
          var ls = d.createElement(t); ls.async = true; ls.src = u;
          var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(ls, s);
      }(window, document, 'script', window['__ls_script_url'], window['__ls_namespace']);
  
      LiveSession("init", "e91cab7c.f76e7165", { keystrokes: false, rootHostname : '.openq.dev' });
      LiveSession("newPageView");
      LiveSession("getSessionURL", function(url, isNewSession){
        if(isNewSession){
            ga('send', {
                hitType: 'event',
                eventCategory: 'LiveSession recording',
                eventAction: url,
                nonInteraction: 1
            })
        }
    });`}
      </Script>
      <div className='bg-dark-mode font-segoe text-primary'>
        <UserContext.Provider value={[user, setUser]}>
          <AuthProvider>
            <Web3ReactProvider connectors={connectors}>
              <StoreProvider>
                <SetContextState>
                  <ErrorBoundary>
                    <div className='' id='modalroot'></div>
                    <div className='min-h-screen  flex flex-col justify-between'>
                      <div>
                        {router.asPath == '/login' ? null : <Navigation />}
                        <FirstTimeBanner />
                        <Component key={router.asPath} {...pageProps} />
                      </div>
                      <Footer isWhite={isWhiteBgRoute} />
                    </div>
                  </ErrorBoundary>
                </SetContextState>
              </StoreProvider>
            </Web3ReactProvider>
          </AuthProvider>
        </UserContext.Provider>
      </div>
    </>
  );
}

export default OpenQ;
