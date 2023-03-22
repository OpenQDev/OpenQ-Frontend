import React, { useContext } from 'react';
import ModalDefault from './ModalDefault';
import { useRouter } from 'next/router';
import Image from 'next/image';
import GithubSignIn from '../Authentication/GithubSignIn';
import StoreContext from '../../store/Store/StoreContext';

const UnexpectedErrorModal = ({ error, closeModal }) => {
  let currentError = '';
  let loginModal;
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  appState.logger.error(error, accountData.id, 'UnexpectedError.js1');
  let parsedError;
  try {
    parsedError = JSON.parse(error);
  } catch (jsonError) {
    appState.logger.error(error, accountData.id, 'UnexpectedError.js2');
    appState.logger.error(jsonError, accountData.id, 'UnexpectedError.js2');
  }
  if (error.graphQLErrors && error.graphQLErrors[0].type == 'RATE_LIMITED') {
    currentError = `Looks like you're a power user...We're still building and have limited Github access at the moment. 
        Please give it a rest, go get a coffee, and come back in about an hour. 
        Your Github auth should be good by then.`;
  } else {
    currentError = parsedError?.message || error || currentError;
  }
  if (JSON.stringify(error).includes('github') && (error.includes('401') || error.includes('EHOSTUNREACH'))) {
    loginModal = true;
  }
  const router = useRouter();
  const resetState = () => {
    if (typeof closeModal === 'function') closeModal();
    else router.push('/');
  };
  const signIn = (
    <div>
      <GithubSignIn />
    </div>
  );
  if (loginModal)
    return (
      <ModalDefault
        title={'Please login with Github.'}
        footerRight={signIn}
        setShowModal={() => {}}
        resetState={resetState}
      >
        <p>Please log in with github to continue browsing.</p>
      </ModalDefault>
    );

  return (
    <div className='bg-info border-info-strong border rounded-sm items-center p-4 my-2 mx-2 lg:mx-24'>
      <h1 className='text-2xl pb-2'>Unexpected Error</h1>
      <p>Unfortunately we could not process your request due to a technical issue. </p>
      <p>Error: {currentError ? currentError : 'There was an error fetching data for your page.'}</p>
      <p className='flex flex-wrap'>
        If the issue keeps happening, contact us at info@openq.dev or ask us in{' '}
        <a
          href={'https://discord.gg/puQVqEvVXn'}
          target={'_blank'}
          className='flex text-link-colour'
          rel='noopener noreferrer'
        >
          <Image src={'/social-icons/discord.svg'} width={24} height={24} alt='discord icon' className='mx-2' />
          discord
        </a>
        .
      </p>
      {typeof error === 'string' && error?.includes('Github') && (
        <span className='underline'>
          <a href={'https://www.githubstatus.com/'}>Check Github Status</a>.
        </span>
      )}
    </div>
  );
};
export default UnexpectedErrorModal;
