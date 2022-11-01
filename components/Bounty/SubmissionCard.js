import React from 'react';
import SubmissionCardAdmin from './SubmissionCardAdmin';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

const SubmissionCard = ({ pr, bounty }) => {
  const admin = true;
  const { source } = pr;
  const author = source.author;
  /*div className='border border-web-gray h-96 p-4 text-lg'>
      <h3 className='text-2xl font-bold text-muted'>{source.title}</h3>
      <h3>{source.author.name || source.author.login}</h3>
      <h3>{source.bodyText}</h3>
      <a href={source.url} className='underline'>
        {source.author.name || source.author.login}
      </a>
      {admin && <SubmissionCardAdmin />}
    </div>*/
  return (
    <div className={`min-w-[300px] w-60  border border-border-gray bg-menu-bg`}>
      <Link href={source.url}>
        <div
          className={
            'flex flex-col p-6 items-center cursor-pointer text-[0.8rem] tracking-wider placeholder-input-gray outline-none rounded-sm w-full h-72 mb-1'
          }
        >
          <div className='flex justify-end w-full items-center -mt-2 relative pt-2'></div>
          <div className='pt-2'>
            <div className='w-16 h-16 relative'>
              {author?.avatarUrl ? (
                <Image
                  className='rounded-full'
                  src={author?.avatarUrl}
                  placeholder={'blur'}
                  blurDataURL={'/diverse/placeholder-px.png'}
                  alt='n/a'
                  layout='fill'
                  priority={true}
                />
              ) : (
                <Skeleton baseColor='#333' borderRadius={'1rem'} height={'64px'} width='64px' />
              )}
            </div>
          </div>
          <div className='pt-5 text-center w-full font-medium text-xl '>{source.title}</div>
          <div className='text-center pt-2 text-gray-400 w-full'>{source.author.name || source.author.login}</div>

          <div className='text-center pt-2 text-gray-400 w-full'>
            {source.body}asdffffffffffffffffffffff asdf asdf asdf asdfasdfsadf asdf asdfasdf asdfas dfasdfasdfasdf sadf
            asdf asdf sadf asdfas dfas dfsadf sadf{' '}
          </div>
        </div>
      </Link>
      {admin && <SubmissionCardAdmin bounty={bounty} />}
    </div>
  );
};
export default SubmissionCard;
