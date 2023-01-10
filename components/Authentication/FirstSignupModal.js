import React, { useContext, useState } from 'react';
import ModalLarge from '../Utils/ModalLarge';
import Image from 'next/image';
import AuthContext from '../../store/AuthStore/AuthContext';
import SelectItem from './SelectItem';
import SignOut from './SignOut';
import StoreContext from '../../store/Store/StoreContext';

const FirstSignupModal = ({ closeModal, setShowModal }) => {
  const [authState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const [subscribe, setSubscribe] = useState(false);
  const [email, setEmail] = useState(appState.accountData.email);
  const roles = [
    'Engineer',
    'Founder',
    'Product Manager',
    'Project Manager',
    'QA',
    'Designer',
    'Student',
    'Marketing',
    'Other',
  ];
  const products = ['Marketplace', 'Hackathon', 'DRM', 'Not sure'];

  async function submit() {
    closeModal();
    if (subscribe && email) {
      try {
        const formData = new FormData();
        formData.append('api_key', 'JlUKxDNJAmbFF44byOHTNQ');
        formData.append('email', email);
        const response = await fetch('https://api.convertkit.com/v3/forms/3697685/subscribe', {
          method: 'POST',
          body: formData,
        });
        await response.json();
      } catch (err) {
        appState.logger.error(err, appState.accountData.id, 'FirstSignupModal.js1');
      }
    }
  }

  const btn = (
    <button className='btn-primary' onClick={() => submit()}>
      Continue
    </button>
  );

  console.log(email);
  console.log(appState.accountData);

  return (
    <ModalLarge
      isWalletConnect={true}
      title={
        <div className='flex justify-between text-sm'>
          <div>
            <Image src='/openq-logo-with-text.png' width={150} height={150} />
          </div>
          <div className='flex flex-col md:flex-row items-center md:gap-4 pr-8'>
            <div className=''>{authState.login}</div>
            <SignOut
              styles={
                ' border-none bg-transparent text-[#1f6feb] md:hover:underline hover:bg-transparent rounded-none justify-start'
              }
              hidePropic={true}
            />
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
        <SelectItem fieldName={'otherRoles'} items={roles} />
        <p className='font-semibold pt-4 py-2'>Tell us about your skills</p>
        <input className='input-field w-full' />
        <p className='font-semibold pt-4 py-2'>Which OpenQ products are you interested in?</p>
        <SelectItem fieldName={'interests'} items={products} />
        <div className='flex flex-col pt-8 py-2'>
          <div className='flex items-center justify-start gap-2'>
            <input type='checkbox' className='checkbox' onChange={() => setSubscribe(!subscribe)}></input>
            <p className='font-semibold'>Join hundreds of professionals learning with OpenQ</p>
          </div>

          <div className='flex flex-col pt-4 pl-8 text-muted gap-2'>
            {subscribe && !appState.acountData?.email && (
              <input
                className='input-field w-full'
                placeholder='Enter your email'
                size='sm'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <p>
              Curated emails on the latest software and web3 topics, product updates, events and new opportunities for
              your career.
            </p>
          </div>
        </div>
      </div>
    </ModalLarge>
  );
};
export default FirstSignupModal;
