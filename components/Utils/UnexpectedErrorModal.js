import React, { useContext, useEffect, useState } from 'react';
import ModalDefault from './ModalDefault';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
    <a
      href={'https://discord.gg/puQVqEvVXn'}
      className='flex items-center gap-2 btn-primary'
      target={'_blank'}
      rel='noopener noreferrer'
    >
      <div data-testid='link' className='flex items-center gap-2'>
        <Image src={'/social-icons/discord.svg'} width={24} height={24} />
        Get Help!
      </div>
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
    <ModalDefault title={'Unexpected Error'} footerRight={btn} setShowModal={() => {}} resetState={resetState}>
      <p className='pb-4'>Unfortunately we could not process your request due to a technical issue on our end. </p>
      <p className='pb-4'>Error: {error ? error : 'There was an error fetching data for your page.'}</p>
      <p>
        {' '}
        Please try again. If the issue keeps happening, contact us at info@openq.dev or ask us in{' '}
        <a href={'https://discord.gg/puQVqEvVXn'} target={'_blank'} className='text-blue-500' rel='noopener noreferrer'>
          discord
        </a>
      </p>
      {typeof error === 'string' && error?.includes('Github') && (
        <span className='underline'>
          <a href={'https://www.githubstatus.com/'}>Check Github Status</a>.
        </span>
      )}
    </ModalDefault>
  );
};
export default UnexpectedErrorModal;
