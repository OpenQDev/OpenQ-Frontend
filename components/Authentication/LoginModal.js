import React, { useContext } from 'react';
import ModalLarge from '../Utils/ModalLarge';
import EmailLogin from './EmailLogin';
import AuthButton from './AuthButton';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AuthContext from '../../store/AuthStore/AuthContext';

const LoginModal = ({ closeModal, setShowModal }) => {
  const router = useRouter();
  const [authState] = useContext(AuthContext);

  const btn = (
    <button onClick={closeModal} className='btn-default w-full'>
      Close
    </button>
  );

  return (
    <ModalLarge
      isWalletConnect={true}
      title={'Log in to use OpenQ'}
      footerRight={btn}
      setShowModal={setShowModal}
      resetState={closeModal}
    >
      <div className='p-4'>
        <p className='text-xl py-2'>Signing in to OpenQ will give you access to the following benefits:</p>
        <ul className='pl-8 p-2 list-disc'>
          <li>Participation in Hackathons</li>
          <li>Receiving updates for upcoming Hackathons</li>
          <li>Getting notified when your starred organizations post new issues</li>
          <li>Following any new actions on the issues you are watching</li>
          <li>
            Other (brainstorm): level progression updates, getting contacted by interested organizations, receiving
            potential prizes for continuing working on projects submitted at Hackathons...
          </li>
          <li>
            <div className='text-link-colour'>"more..."</div> on every point? {'=>'} cf page that is more exhaustive and
            link to specific point on it
          </li>
        </ul>
        <div className='flex flex-col md:flex-row p-4 gap-4 md:items-center'>
          {authState.isAuthenticated ? (
            <div className='flex items-center gap-2'>
              You are signed in as <div className='text-link-colour'>{authState.login}</div>
              {authState.avatarUrl && (
                <Image src={authState.avatarUrl} width={31} height={31} alt={'profile pic'} className='rounded-full' />
              )}
            </div>
          ) : (
            <div className='flex gap-2'>Sign in with your Github account: </div>
          )}

          <AuthButton
            redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL}` + router.asPath}
            /* propicUrl={} */ className={'w-fit'}
            hideSignOut={false}
            signInStyle={'btn-primary'}
          />
        </div>
        <div className='flex p-4'>
          <EmailLogin />
        </div>
      </div>
    </ModalLarge>
  );
};
export default LoginModal;
