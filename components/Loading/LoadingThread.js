import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './LoadingThread.module.css';

const LoadingBar = () => {
  const [routeChanging, setRouteChanging] = useState(0);
  const router = useRouter(0);
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setRouteChanging(70);
    };
    const handlerouteChangeComplete = () => {
      console.log('exec');
      setRouteChanging(100);
      setTimeout(() => {
        setRouteChanging(null);
        setTimeout(() => {
          setRouteChanging(0);
        }, 1000);
      }, 1000);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handlerouteChangeComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handlerouteChangeComplete);
    };
  }, []);
  return (
    <div
      className={`flex fixed top-0  bg-link-colour
	   ${styles.animationDefault}
	   ${routeChanging === null && styles.animationHidden}
	   ${routeChanging === 0 && styles.animationStart}
	   ${routeChanging > 69 && styles.animationStageOne} 
	 
	  ${routeChanging > 99 && styles.animationStageTwo}
	  z-40 py-px bg-link-color self-start left-0 w-full bg- border-web-gray h-0.5 `}
    ></div>
  );
};

export default LoadingBar;
