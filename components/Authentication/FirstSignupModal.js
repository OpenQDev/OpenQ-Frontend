import React, { useContext } from 'react';
import ModalLarge from '../Utils/ModalLarge';
import Image from 'next/image';
import AuthContext from '../../store/AuthStore/AuthContext';

const FirstSignupModal = ({ closeModal, setShowModal }) => {
  const [authState] = useContext(AuthContext);

  const btn = <button className='btn-primary'>Continue</button>;

  return (
    <ModalLarge
      isWalletConnect={true}
      title={
        <div className='flex justify-between text-sm'>
          <Image src='/openq-logo-with-text.png' width={150} height={150} />
          <div className='flex items-center gap-2 pr-8'>
            <div className=''>LoginName{authState.login}</div>
            {authState.avatarUrl && (
              <Image src={authState.avatarUrl} width={31} height={31} alt={'profile pic'} className='rounded-full' />
            )}
            <button className='text-blue-500 hover:underline'>Sign Out (Link)</button>
          </div>
        </div>
      }
      footerRight={btn}
      setShowModal={setShowModal}
      resetState={closeModal}
    >
      <div className='mx-4 p-4'>
        <p className='text-2xl font-semibold  py-2'>Tell us a bit about yourself</p>
        <p className='font-semibold py-2'>What is your role?</p>
        <p className='font-semibold py-2'>Tell us about your skills</p>
        <input className='input-field w-full bg-black' />
        <p className='font-semibold py-2'>Which OpenQ products are you interested in?</p>
        <div className='flex flex-col py-2'>
          <div className='flex items-center justify-start gap-2'>
            <input type='checkbox' className='checkbox' /* onChange={} */></input>
            <p className='font-semibold'>Join hundreds of professionals learning with OpenQ</p>
          </div>
          <p className='pl-8 text-muted'>
            Curated emails on the latest software and web3 topics, product updates, events and new opportunities for
            your career.
          </p>
        </div>
      </div>
    </ModalLarge>
  );
};
export default FirstSignupModal;
