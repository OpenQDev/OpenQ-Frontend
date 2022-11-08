// Third party Libraries
//import { Magic } from 'magic-sdk';
//import { OAuthExtension } from '@magic-ext/oauth';
import React, { useEffect, useState } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import 'tailwindcss/tailwind.css';
import 'github-markdown-css/github-markdown-dark.css';
import { useRouter } from 'next/router';

// Custom
import { UserContext } from '../lib/UserContext';
import '../styles/globals.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Navigation from '../components/Layout/Navigation';
import Head from 'next/head';
import Footer from '../components/Layout/Footer';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import {
  walletConnect,
  walletConnectHooks,
  metaMask,
  metaMaskHooks,
  gnosisSafe,
  gnosisSafeHooks,
} from '../components/WalletConnect/connectors';

function OpenQ({ Component, pageProps }) {
  const connectors = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [gnosisSafe, gnosisSafeHooks],
  ];

  const [user, setUser] = useState();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, set it to {user: null}
  /*
  useEffect(() => {
    setUser({ loading: true });
    let magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      return isLoggedIn ? magic.user.getMetadata().then((userData) => setUser(userData)) : setUser({ user: null });
    });
  }, []);
*/
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
  return (
    <div className='bg-dark-mode font-segoe text-primary'>
      {/* Global Site Tag (gtag.js) - Google Analytics */}

      <Head>
        <title>OpenQ | Tempo Engineering, scale better with Atomic Contracts</title>
        <meta name='OpenQ Bounties' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/openq-logo.png' />
        <link rel='manifest' href='/manifest.json' crossOrigin='use-credentials' />
        <script type='text/javascript'>
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
        </script>
      </Head>
      <>
        <UserContext.Provider value={[user, setUser]}>
          <AuthProvider>
            <StoreProvider>
              <Web3ReactProvider connectors={connectors}>
                <div className='min-h-screen  flex flex-col justify-between'>
                  <div>
                    <Navigation />
                    <Component key={router.asPath} {...pageProps} />
                  </div>
                  <Footer />
                </div>
              </Web3ReactProvider>
            </StoreProvider>
          </AuthProvider>
        </UserContext.Provider>
      </>
    </div>
  );
}

export default OpenQ;
