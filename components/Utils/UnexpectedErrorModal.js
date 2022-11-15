import React, { useEffect, useState } from 'react';
import ModalDefault from './ModalDefault';
import { useRouter } from 'next/router';
import SignIn from '../Authentication/SignIn';

const UnexpectedErrorModal = ({ error }) => {
  const [currentError, setCurrentError] = useState('');
  const [loginModal, setLoginModal] = useState(false);
  useEffect(() => {
    let parsedError;
    try {
      parsedError = JSON.parse(error);
      console.log(parsedError);
    } catch (err) {
      console.log(err);
    }

    setCurrentError(parsedError?.message || currentError);

    if (error.includes('github') && error.includes('401')) {
      setLoginModal(true);
    }
  }, []);
  const router = useRouter();
  const resetState = () => {
    router.push('/');
  };
  const btn = (
    <div>
      <SignIn />
    </div>
  );
  if (loginModal)
    return (
      <ModalDefault
        title={'Please login with Github.'}
        footerRight={btn}
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
