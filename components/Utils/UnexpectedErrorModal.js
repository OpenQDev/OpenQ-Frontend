import React, { useContext, useEffect, useState } from 'react';
import ModalDefault from './ModalDefault';
import { useRouter } from 'next/router';
import useWeb3 from '../../hooks/useWeb3';
import SignIn from '../Authentication/SignIn';
import StoreContext from '../../store/Store/StoreContext';

const UnexpectedErrorModal = ({ error }) => {
  const [currentError, setCurrentError] = useState('');
  const [loginModal, setLoginModal] = useState(false);
  const { account } = useWeb3();
  const [appState] = useContext(StoreContext);
  useEffect(() => {
    let parsedError;
    try {
      parsedError = JSON.parse(error);
    } catch (err) {
      appState.logger.error(err, account);
    }

    setCurrentError(parsedError?.message || error || currentError);
    if (error.includes('github') && error.includes('401')) {
      setLoginModal(true);
    }
  }, []);
  const router = useRouter();
  const resetState = () => {
    router.push('/');
  };
  const signIn = (
    <div>
      <SignIn />
    </div>
  );
  const btn = (
    <a href={'/'} className='flex btn-default' type='link'>
      Go Home
    </a>
  );
  if (loginModal)
    return (
      <ModalDefault
        title={'Please login with Github.'}
        footerRight={signIn}
        setShowModal={() => {}}
        resetState={resetState}
      >
        <p>Please log in with github to contiue browsing.</p>
      </ModalDefault>
    );

  return (
    <ModalDefault title={'Oops, something wrong.'} footerRight={btn} setShowModal={() => {}} resetState={resetState}>
      <p>
        Sorry, something went wrong. {currentError ? currentError : 'There was an error fetching data for your page.'}
      </p>
      {typeof currentError === 'string' && currentError?.includes('Github') && (
        <span className='underline'>
          <a href={'https://www.githubstatus.com/'}>Check Github Status</a>.
        </span>
      )}
    </ModalDefault>
  );
};
export default UnexpectedErrorModal;
