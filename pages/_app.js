// Third party Libraries
import React, { useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import 'tailwindcss/tailwind.css';
import 'github-markdown-css/github-markdown-dark.css';
import { useRouter } from 'next/router';
import Script from 'next/script';

// Custom
import '../styles/globals.css';
import StoreProvider from '../store/Store/StoreProvider';
import AuthProvider from '../store/AuthStore/AuthProvider';
import Navigation from '../components/Layout/Navigation';
import Head from 'next/head';
import Footer from '../components/Layout/Footer';
import ReactGA from 'react-ga4';

function OpenQ({ Component, pageProps }) {
  function getLibrary(provider) {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }
  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
  }, []);
  const router = useRouter();
  return (
    <div className='bg-dark-mode font-segoe text-primary'>
      {/* Global Site Tag (gtag.js) - Google Analytics */}

      <Script
        onLoad={() => {
          (function (h, o, t, j, a, r) {
            h.hj =
              h.hj ||
              function () {
                (h.hj.q = h.hj.q || []).push(arguments);
              };
            h._hjSettings = { hjid: 3177116, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        }}
      />

      <Head>
        <title>OpenQ | Tempo Engineering, scale better with Atomic Contracts</title>
        <meta name='OpenQ Bounties' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/openq-logo.png' />
        <link rel='manifest' href='/manifest.json' crossOrigin='use-credentials' />
        <Script type='text/javascript' strategy='lazyOnload'>
          {`window['__ls_namespace'] = 'LiveSession';
    window['__ls_script_url'] = 'https://cdn.livesession.io/track.js';
    !function(w, d, t, u, n) {
          if (n in w) {if(w.console && w.console.log) { w.console.log('LiveSession namespace conflict. Please set window["__ls_namespace"].');} return;}
          if (w[n]) return; var f = w[n] = function() { f.push ? f.push.apply(f, arguments) : f.store.push(arguments)};
          if (!w[n]) w[n] = f; f.store = []; f.v = "1.1";
  
          var ls = d.createElement(t); ls.async = true; ls.src = u;
          var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(ls, s);
      }(window, document, 'script', window['__ls_script_url'], window['__ls_namespace']);
  
      LiveSession("init", "e91cab7c.5a8a3643", { keystrokes: false, rootHostname : '.staging.openq.dev' });
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
      </Head>
      <>
        <AuthProvider>
          <StoreProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
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
      </>
    </div>
  );
}

export default OpenQ;
