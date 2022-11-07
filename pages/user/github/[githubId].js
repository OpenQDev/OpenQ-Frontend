// Third party
import React, { useState } from 'react';
import WrappedGithubClient from '../../../services/github/WrappedGithubClient';
import AssociationModal from '../../../components/User/GithubRegistration/AssociationModal';
import Logger from '../../../services/logger/Logger';
import SubMenu from '../../../components/Utils/SubMenu';
import { Gear } from '../../../components/svg/gear';
import Image from 'next/legacy/image';

const account = ({ githubId, githubUser /* , organizations */, renderError }) => {
  const [internalMenu, setInternalMenu] = useState('Settings');

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
        <div className='flex relative max-w-[1440px] w-full mx-auto'>
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
              </div>
            )}
          </div>

          <div className='flex flex-col flex-1 lg:pl-20 '>
            {internalMenu == 'Settings' && (
              <AssociationModal githubId={githubId} user={githubUser} renderError={renderError} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const githubId = context.params.githubId;
  const githubRepository = new WrappedGithubClient();
  githubRepository.instance.setGraphqlHeaders();
  const logger = new Logger();
  let renderError = '';
  let githubUser = {};
  try {
    githubUser = await githubRepository.instance.fetchUserById(githubId);
  } catch (err) {
    logger.error(err);
    return { props: { renderError: `${githubId} is not a valid GitHub ID.` } };
  }
  return { props: { githubId, renderError, githubUser } };
};

export default account;
