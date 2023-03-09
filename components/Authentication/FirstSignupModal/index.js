import React, { useContext, useEffect, useState } from 'react';
import ModalLarge from '../../Utils/ModalLarge';
import Image from 'next/image';
import AuthContext from '../../../store/AuthStore/AuthContext';
import SelectItem from '../SelectItem';
import SignOut from '../SignOut';
import StoreContext from '../../../store/Store/StoreContext';
import ToolTipNew from '../../Utils/ToolTipNew';
import Username from '../../User/OverviewTab/Username/index';
import LanguagesAndFrameworks from './LanguagesAndFrameworks';
import { useRouter } from 'next/router';
import FreelancerDetails from '../../User/InvoicingDetailsTab/FreelancerDetails';

const FirstSignupModal = ({ closeModal, setShowModal, user }) => {
  const router = useRouter();
  const [authState] = useContext(AuthContext);
  const [appState] = useContext(StoreContext);
  const [subscribe, setSubscribe] = useState(false);
  const [email, setEmail] = useState(appState.accountData.email);
  const [validEmail, setValidEmail] = useState(appState.accountData.email);
  const [disabled, setDisabled] = useState(false);
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

  useEffect(() => {
    if (subscribe && !validEmail) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [subscribe, validEmail]);

  async function submit() {
    if (subscribe && validEmail) {
      try {
        const formData = new FormData();
        formData.append('api_key', process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY);
        formData.append('email', validEmail);
        const response = await fetch('https://api.convertkit.com/v3/forms/3697685/subscribe', {
          method: 'POST',
          body: formData,
        });
        await response.json();
      } catch (err) {
        appState.logger.error(err, appState.accountData.id, 'FirstSignupModal.js1');
      }
    }
    router.reload(`/user/${appState.accountData.id}`);
  }

  function handleChange(e) {
    const mail = e.target.value;
    setEmail(mail);
    setValidEmail(appState.utils.emailRegex(mail) && mail);
  }

  const btn = (
    <ToolTipNew hideToolTip={!disabled} toolTipText={'Please enter a valid email address to subscribe.'}>
      <button
        className={`btn-primary ${disabled && 'cursor-not-allowed'}`}
        onClick={() => submit()}
        disabled={disabled}
      >
        Continue
      </button>
    </ToolTipNew>
  );

  return (
    <ModalLarge
      isWalletConnect={true}
      title={
        <div className='flex justify-between text-sm'>
          <div>
            <Image src='/openq-logo-with-text.png' width={150} height={150} alt='openq-logo' />
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
        <div>
          <p className='text-2xl font-semibold  py-2'>Hello {authState.login}</p>
          <p className='py-2'>If you're coming here as an EthDenver Buidlathon winner, congratulations!</p>
          <p className='py-2'>Let's get you paid.</p>
          <p className='py-2'>Enter your email to stay up to date with next steps in claiming your award.</p>
          <p className='py-2'>
            OpenQ and EthDenver will use this email to tell you when you uploaded forms have been approved, after which
            you can claim right away.
          </p>
        </div>
        <section className='flex flex-col gap-3 pb-6'>
          <FreelancerDetails slim={true} emailOnly={true} />
        </section>
        <p className='text-2xl font-semibold  py-2'>Now, tell us a bit about yourself</p>
        <div className='flex gap-2'>
          <p className='font-semibold py-2'>Username:</p>
          <Username user={appState.accountData} firstSignup={true} />
        </div>
        <p className='font-semibold py-2'>What is your role?</p>
        <SelectItem fieldName={'otherRoles'} items={roles} />
        <LanguagesAndFrameworks user={user} />
        <p className='font-semibold pt-4 py-2'>Which OpenQ products are you interested in?</p>
        <SelectItem fieldName={'interests'} items={products} />
        <div className='flex flex-col pt-8 py-2'>
          <div className='flex items-center justify-start gap-2'>
            <input type='checkbox' className='checkbox' onChange={() => setSubscribe(!subscribe)}></input>
            <p className='font-semibold'>Join hundreds of professionals learning with OpenQ</p>
          </div>

          <div className='flex flex-col pt-4 text-muted gap-2'>
            {subscribe && !appState.acountData?.email && (
              <input
                className='input-field w-full'
                placeholder='Enter your email'
                size='sm'
                value={email}
                onChange={(e) => handleChange(e)}
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
