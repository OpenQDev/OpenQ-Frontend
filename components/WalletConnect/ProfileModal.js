// Third party
import React, { useContext } from 'react';
import Link from 'next/link';
// Custom
import { AlertFillIcon, PersonIcon } from '@primer/octicons-react';
import StoreContext from '../../store/Store/StoreContext';
import AuthContext from '../../store/AuthStore/AuthContext';
import SignOut from '../Authentication/SignOut';

const ProfileModal = ({ domRef, isSafeApp, showModal }) => {
  const [appState] = useContext(StoreContext);
  const [authState] = useContext(AuthContext);
  const { accountData } = appState;

  if (!showModal) return <></>;
  return (
    <div className='flex mr-4 flex-col items-center relative right-7'>
      <div className='flex -mt-2 md:-mt-2 border-b-gray-700 tooltip-triangle absolute left-10'></div>
      <div className='flex z-10 -mt-1.5 md:-mt-1.5 border-b-[#161B22] tooltip-triangle absolute left-10'></div>

      <div
        ref={domRef}
        className='flex absolute flex-col mt-0 pt-2 z-[5] bg-[#161B22] w-52 tooltip border-gray-700 border rounded-sm p-0'
      >
        <div className='flex flex-wrap text-[#c9d1d9]  pl-4  w-full p-3  m-0 gap-1'>
          <span className='text-left break-all'> Signed in as </span>
          <Link
            href={`https://github.com/${authState.login}`}
            className='text-blue-500 hover:underline semi-bold '
            target='_blank'
          >
            <span className='break-all'> {accountData.username}</span>
          </Link>
        </div>
        {!isSafeApp && (
          <div className='flex flex-col w-full'>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${accountData.id}`} className=''>
              <div
                data-testid='link'
                className='flex md:hover:bg-[#1f6feb] h-8 md:hover:z-50 items-center w-full cursor-pointer hover:text-white text-[#c9d1d9] self-start gap-4 p-2'
              >
                <PersonIcon className='w-4 h-4 ml-2' />
                <span>Profile</span>
              </div>
            </Link>
          </div>
        )}
        {!isSafeApp && (
          <div className='flex flex-col w-full'>
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/requests/${accountData.id}`} className=''>
              <div
                data-testid='link'
                className='flex md:hover:bg-[#1f6feb] h-8 md:hover:z-50 items-center w-full cursor-pointer hover:text-white text-[#c9d1d9] self-start gap-4 p-2'
              >
                <AlertFillIcon className='w-4 h-4 ml-2' />
                <span>Requests</span>
              </div>
            </Link>
          </div>
        )}
        {authState.isAuthenticated && (
          <SignOut
            styles={' border-none bg-transparent md:hover:bg-[#1f6feb] rounded-none justify-start mb-2'}
            hidePropic={true}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
