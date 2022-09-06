// Third party
import React, { useContext } from 'react';
import axios from 'axios';
// Custom
import AuthContext from '../../store/AuthStore/AuthContext';
import Image from 'next/image';

const SignOut = ({ propicUrl }) => {
  const [, setAuthState] = useContext(AuthContext);

  const signOut = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        setAuthState({
          type: 'UPDATE_IS_AUTHENTICATED',
          payload: res.data.isAuthenticated,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <button
      onClick={() => signOut()}
      className={'flex justify-center btn-default hover:border-[#8b949e] hover:bg-[#30363d] w-full'}
    >
      <div className='flex flex-row justify-center items-center space-x-3'>
        <div className='h-4 w-4 md:h-6 md:w-6 relative'>
          <Image
            src={propicUrl || '/social-icons/github-logo-white.svg'}
            alt='Picture of the author'
            layout='fill'
            objectFit='cover'
            className={'rounded-full'}
          />
        </div>
        <div>Sign Out</div>
      </div>
    </button>
  );
};

export default SignOut;
