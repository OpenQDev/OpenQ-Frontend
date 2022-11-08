import React from 'react';
import ModalDefault from './ModalDefault';
import { useRouter } from 'next/router';

const UnexpectedErrorModal = ({ error }) => {
  const router = useRouter();
  const resetState = () => {
    router.push('/');
  };
  const btn = (
    <a href={'/'} className='flex btn-default' type='link'>
      Go Home
    </a>
  );
  return (
    <ModalDefault title={'Oops, something wrong.'} footerRight={btn} setShowModal={() => {}} resetState={resetState}>
      <p>Sorry, something went wrong. {error ? error : 'There was an error fetching data for your page.'}</p>
      {typeof error === 'string' && error?.includes('Github') && (
        <span className='underline'>
          <a href={'https://www.githubstatus.com/'}>Check Github Status</a>.
        </span>
      )}
    </ModalDefault>
  );
};
export default UnexpectedErrorModal;
