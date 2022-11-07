// Third party
import React, { useEffect, useState, useContext } from 'react';
import Image from "next/legacy/image";
import { useRouter } from 'next/router';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import AuthButton from '../../components/Authentication/AuthButton';

const ProfilePicture = ({ mobile, styles }) => {
  // Context
  const [authState] = useContext(AuthContext);
  const router = useRouter();
  // State
  const [propicUrl, setProPicUrl] = useState(null);
  const [showModal, setShowModal] = useState(!authState.isAuthenticated);

  // Effects
  useEffect(() => {
    async function setProfilePicture() {
      const avatarUrl = authState.avatarUrl;
      setProPicUrl(avatarUrl);
    }
    setProfilePicture();
    if (authState.isAuthenticated) {
      setShowModal(false);
    }
  }, [authState]);

  return (
    <div className={`flex items-center h-12 content-center  ${styles}`}>
      {showModal || !authState.isAuthenticated ? (
        <div className={'flex w-max'}>
          <AuthButton redirectUrl={process.env.NEXT_PUBLIC_BASE_URL + router.asPath} propicUrl={propicUrl} />
          {authState.isAuthenticated && <button onClick={() => setShowModal(false)}> </button>}
        </div>
      ) : (
        <button
          className='flex items-center border border-gray-700 hover:border-opacity-70 rounded-full'
          onClick={() => setShowModal(true)}
        >
          {propicUrl != null ? (
            <Image
              src={propicUrl}
              width={mobile ? 62 : 31}
              height={mobile ? 62 : 31}
              alt={'profile pic'}
              className='rounded-full'
            />
          ) : null}
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;
