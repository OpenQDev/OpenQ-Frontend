import { LocationIcon } from '@primer/octicons-react';
import React from 'react';
import Discord from '../../svg/discord';
import Twitter from '../../svg/twitter';
import Telegram from '../../svg/telegram';
import Slack from '../../svg/slack';
import Link from 'next/link';
import NoSSR from '../../Utils/NoSSR';

const HackathonMetadata = ({ hackathon }) => {
  const { slack, telegram, twitter, discord, topic, startDate, endDate } = hackathon;
  const hasOneSocial = slack || telegram || twitter || discord;
  const monthDayDateFromStartDate = new Date(parseInt(startDate)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const monthDayDateFromEndDate = new Date(parseInt(endDate)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDateYear = new Date(parseInt(endDate)).getFullYear();
  const nowTillStartDateTimestamp = parseInt(startDate) - Date.now();
  const days = Math.floor(nowTillStartDateTimestamp / (1000 * 60 * 60 * 24));
  const hours = Math.floor((nowTillStartDateTimestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((nowTillStartDateTimestamp % (1000 * 60 * 60)) / (1000 * 60));
  const formattedWaitTime = `${days}d:${hours}h:${minutes}m`;
  return (
    <ul className='lg:max-w-[300px] space-y-4  w-full lg:pl-4 p-8  lg:px-0 lg:pt-4'>
      <li>
        <div className='text-muted'>Event Location</div>
        <div className='flex gap-1 text-xs my-1.5  font-semibold'>
          <LocationIcon className='relative self-start' />
          {hackathon.city}
        </div>
      </li>
      {hasOneSocial && (
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
      )}
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Runs From</div>
        <div className='pl-6 my-1.5 flex gap-2'>
          <NoSSR>
            {monthDayDateFromStartDate} - {monthDayDateFromEndDate}, {endDateYear}
          </NoSSR>
        </div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Hackathon Starts in</div>
        <div className='pl-6 my-1.5 flex gap-2'>
          <NoSSR>{formattedWaitTime}</NoSSR>
        </div>
      </li>
      <li className='py-1.5 border-t border-web-gray'>
        <div className='text-muted'>Topics</div>
        <div className='pl-6 my-1.5 flex gap-2'>{topic.map((topic) => topic)}</div>
      </li>
    </ul>
  );
};

export default HackathonMetadata;
