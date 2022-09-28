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

function OpenQ({ Component, pageProps }) {
  function getLibrary(provider) {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  const router = useRouter();
  useEffect(() => {
    const pageview = (url) => {
      if (window.gtag) {
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
    <div className='bg-dark-mode font-segoe text-primary'>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
      />

      <Script strategy='lazyOnload'>
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
  `}
      </Script>

      <script type='text/javascript'>
        {`
      window['__ls_namespace'] = '__ls';
      window['__ls_script_url'] = 'https://cdn.livesession.io/track.js';
      !function(w, d, t, u, n) {
            if (n in w) {if(w.console && w.console.log) { w.console.log('LiveSession namespace conflict. Please set window["__ls_namespace"].');} return;}
            if (w[n]) return; var f = w[n] = function() { f.push ? f.push.apply(f, arguments) : f.store.push(arguments)};
            if (!w[n]) w[n] = f; f.store = []; f.v = "1.1";
    
            var ls = d.createElement(t); ls.async = true; ls.src = u;
            var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(ls, s);
        }(window, document, 'script', window['__ls_script_url'], window['__ls_namespace']);
    
        __ls("init", "${process.env.NEXT_PUBLIC_LS_TRACKING_ID}", { keystrokes: false, rootHostname: "${process.env.NEXT_PUBLIC_LS_ROOT_HOSTNAME}" });
        __ls("newPageView");
        __ls("getSessionURL", function(url, isNewSession){
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
      <Head>
        <title>OpenQ | Tempo Engineering, scale better with Atomic Contracts</title>
        <meta name='OpenQ Bounties' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/openq-logo.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <>
        <AuthProvider>
          <StoreProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <div className='min-h-screen overflow-y-hidden flex flex-col justify-between'>
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
