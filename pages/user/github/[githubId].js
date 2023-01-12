// Third party
import React, { useState } from 'react';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import AssociationModal from '../../../components/User/GithubRegistration/AssociateAddress';
import Logger from '../../../services/logger/Logger';
import SubMenu from '../../../components/Utils/SubMenu';
import Gear from '../../../components/svg/gear';
import Image from 'next/image';
import AuthButton from '../../../components/Authentication/AuthButton';
import { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';

import nookies from 'nookies';

const account = ({ githubId, githubUser, renderError }) => {
  const [internalMenu, setInternalMenu] = useState('Settings');
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;

  return (
    <div className=' gap-4 justify-center pt-6'>
      <div className='flex flex-col justify-center'>
        <SubMenu
          internalMenu={internalMenu}
          updatePage={setInternalMenu}
          styles='w-full justify-center lg:justify-start max-w-[600px] mx-auto border-none'
          colour='rust'
          items={[{ name: 'Settings', Svg: Gear }]}
        />
        <div className='w-full border-b h-px border-web-gray'></div>
        <div className='flex relative max-w-[1440px] mx-auto px-16'>
          <div className='hidden lg:block max-w-[25%] border-web-gray pl-4 left-24 xl:left-20 relative'>
            {githubUser && (
              <div className='flex flex-col items-center gap-4'>
                <div className='flex content-center relative top-4 xl:-top-4'>
                  <Image
                    src={githubUser.avatarUrl}
                    width={292}
                    height={292}
                    alt={'profile pic'}
                    className='rounded-full'
                  />
                </div>
                <a href={githubUser.url} className='hover:underline mt-2 text-xl font-semibold'>
                  {githubUser.login}
                </a>

                <AuthButton />
              </div>
            )}
          </div>

          <div className='flex flex-col flex-1 md:pl-36 pr-4 '>
            {internalMenu == 'Settings' && (
              <AssociationModal githubId={githubId} user={githubUser} renderError={renderError} />
            )}
            <div className='xs:w-60 py-8 lg:hidden'>
              <h2 className='text-2xl pb-4 font-semibold'>Sign {accountData.github ? 'out of' : 'into'} Github</h2>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
	const githubRepository = new WrappedGithubClient();
  const logger = new Logger();
	
	const githubId = context.params.githubId;

  let renderError = '';
  let githubUser = {};
  try {
    githubUser = await githubRepository.instance.fetchUserById(githubId);
  } catch (err) {
    logger.error(err, null, 'login.js1');
    return { props: { renderError: `${githubId} is not a valid GitHub ID.` } };
  }
  return { props: { githubId, renderError, githubUser, oauthToken } };
};

export default account;
