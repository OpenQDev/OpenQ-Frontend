// Third party
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';

const ProfilePicture = ({ mobile, styles }) => {
  // Context
  const [authState] = useContext(AuthContext);
  // State
  const [propicUrl, setProPicUrl] = useState(null);

  // Effects
  useEffect(() => {
    async function setProfilePicture() {
      const avatarUrl = authState.avatarUrl;
      setProPicUrl(avatarUrl);
    }
    setProfilePicture();
  }, [authState]);

  return (
    <div className={`flex items-center h-12 content-center  ${styles}`}>
      <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/github/${authState.githubId}`}>
        <div className='flex items-center border border-gray-700 hover:border-opacity-70 rounded-full'>
          {propicUrl != null ? (
            <Image
              src={propicUrl}
              width={mobile ? 62 : 31}
              height={mobile ? 62 : 31}
              alt={'profile pic'}
              className='rounded-full'
            />
          ) : null}
        </div>
      </Link>
    </div>
  );
};

export default ProfilePicture;
