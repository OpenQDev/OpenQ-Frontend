import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToolTipNew from '../../Utils/ToolTipNew';
import { marked } from 'marked';

const ViewBody = ({ githubRepository, hackathon }) => {
  const file = githubRepository.defaultBranchRef.target.file.object.text;

  const parsedText = marked.parse(file);

  //const html = marked.parse(repository.object.text);
  const avatarUrl = 'https://avatars.githubusercontent.com/u/77402538?s=200&v=4';
  const url = githubRepository.owner.url;
  const organization = githubRepository.owner.login;
  const createHackathonTimestamp = parseInt(hackathon.createdAsHackathonDate);
  const humanReadableHackathonDate = new Date(createHackathonTimestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <div className='w-full pt-4 flex relative flex-1 pr-16 min-w-[260px]'>
      <Link href={url} className='w-9 h-9 flex-none'>
        <>
          {' '}
          <ToolTipNew toolTipText={organization} relativePosition={'-left-2'} outerStyles={'relative bottom-2'}>
            <>
              <Image className='rounded-full' height={36} width={36} src={avatarUrl} alt='avatar' />
            </>
          </ToolTipNew>
        </>
      </Link>
      <div className='w-full'>
        <div
          className={` bg-nav-bg flex-0 rounded-t-sm overflow-hidden ml-4 border-web-gray before:w-2 before:h-2 before:bg-nav-bg before:absolute before:left-12 before:top-[34px] before:border-b  before:border-l before:border-web-gray before:rotate-45
         border`}
        >
          <div className={` w-full pl-3 flex justify-between`}>
            <span className='py-2'>
              <span data-testid='actionTitle'>{organization}</span> created this hackathon on{' '}
              {humanReadableHackathonDate}.
            </span>
          </div>
        </div>
        <div
          className={` bg-nav-bg flex-0 rounded-b-sm overflow-hidden ml-4 border-web-gray before:w-2 before:h-2 before:bg-nav-bg before:absolute before:left-12 before:top-[34px] before:border-b  before:border-l before:border-web-gray before:rotate-45
          border-x border-b`}
        >
          <div className='markdown-body p-8' dangerouslySetInnerHTML={{ __html: parsedText }}></div>
        </div>
      </div>
    </div>
  );
};
export default ViewBody;
