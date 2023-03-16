import { LocationIcon } from '@primer/octicons-react';
import React from 'react';
import Discord from '../../svg/discord';
import Twitter from '../../svg/twitter';
import Telegram from '../../svg/telegram';
import Slack from '../../svg/slack';
import Link from 'next/link';

const HackathonMetadata = () => {
  const repository = {
    slack: 'https://slack.com',
    telegram: 'https://telegram.com',
    twitter: 'https://twitter.com',
    discord: 'https://discord.com',
    topic: ['web3', 'social good'],
  };
  const { slack, telegram, twitter, discord, topic } = repository;
  return (
    <ul className='lg:max-w-[300px] space-y-4  w-full lg:pl-4 p-8  lg:px-0 lg:pt-4'>
      <li>
        <div className='text-muted'>Event Location</div>
        <div className='flex gap-1 text-xs my-1.5  font-semibold'>
          <LocationIcon className='relative top-1' />
          N- Line to 48th and Western Standard, Denver, Colorado
        </div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Socials</div>
        <div className='pl-6 my-1.5 flex gap-2'>
          {discord && (
            <Link href={discord}>
              <Discord />
            </Link>
          )}
          {twitter && (
            <Link href={twitter}>
              <Twitter />
            </Link>
          )}
          {slack && (
            <Link href={slack}>
              <Slack />
            </Link>
          )}
          {telegram && (
            <Link href={telegram}>
              <Telegram />
            </Link>
          )}
        </div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Runs From</div>
        <div className='pl-6 my-1.5 flex gap-2'>Dec 2 - 4, 2022</div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Hackathon Starts in</div>
        <div className='pl-6 my-1.5 flex gap-2'>8d:15h:23m</div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Topics</div>
        <div className='pl-6 my-1.5 flex gap-2'>{topic.map((topic) => topic)}</div>
      </li>
    </ul>
  );
};

export default HackathonMetadata;
