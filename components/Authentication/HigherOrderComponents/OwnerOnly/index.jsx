import React, { useContext, useEffect } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import { useRouter } from 'next/router';

const AuthorizedOnly = ({ children, expectedId, slug, any }) => {
  const router = useRouter();
  const [appState] = useContext(StoreContext);
  const isOwner = expectedId && expectedId === appState.accountData.id;

  useEffect(() => {
    let didCancel, id;
    if (!isOwner && !any) {
      const delayedPush = () => {
        if (didCancel) return;

        router.push(`/login?redirect=${slug}`);
      };
      id = setTimeout(delayedPush, 3000);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
      didCancel = true;
    };
  }, [isOwner]);

  return <>{isOwner || any ? { ...children } : <></>}</>;
};
export default AuthorizedOnly;
