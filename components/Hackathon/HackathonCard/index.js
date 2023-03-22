import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, LocationIcon } from '@primer/octicons-react';
import TwitterIcon from '../../svg/twitter';
import { getPlural } from '../../../services/utils/lib';
import Chain from '../../svg/chain';
import NoSSRWrapper from '../../Utils/NoSSR';
import { useRouter } from 'next/router';
const HackathonCard = ({ repository }) => {
  const parsedStartDate = new Date(parseInt(repository.startDate));
  const parsedEndDate = new Date(parseInt(repository.endDate));
  const monthsToStart = parsedStartDate.getMonth() - new Date().getMonth();
  const startDateReadable = parsedStartDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const endDateReadable = parsedEndDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const { query } = useRouter();
  const { proAccountId } = query;
  return (
    <>
      {repository && (
        <div className=''>
          <div className='flex w-full justify-between bg-heading-bg p-4 border-web-gray border  rounded-t-sm'>
            <div className='flex gap-4 items-center'>
              <Image width={48} height={48} src={repository.owner.avatarUrl} />
              <h3 className='font-semibold text-link-colour hover:underline'>
                <Link href={`/hackathons/${repository.id}`}>{repository?.name}</Link>
              </h3>
            </div>
            <div>
              {repository.isDraft && <button className='btn-default bg-input-bg mx-4'>Preview</button>}
              {proAccountId && (
                <Link href={`/hackathons/${repository.id}/edit`} className='btn-default bg-input-bg mx-4'>
                  Edit
                </Link>
              )}
            </div>
          </div>
          <div className='p-4 border-web-gray border-x '>
            <div className='my-2'>{repository.description}</div>
            <div className='my-2 text-link-colour bg-link-colour/20 w-fit px-4 py-0.5 rounded-full'>
              {monthsToStart ? `about ${monthsToStart} month${getPlural(monthsToStart)} left` : 'Happening this month.'}
            </div>
            <div className='flex justify-between'>
              <div className=''>
                <span className='font-bold'>$100,500</span> <span> in prizes</span>
                <span></span>
              </div>
              <div className='flex gap-2 items-center'>
                <CalendarIcon />
                <NoSSRWrapper>
                  <div>
                    {startDateReadable} - {endDateReadable}
                  </div>
                </NoSSRWrapper>
              </div>
            </div>
          </div>
          <div className='border-x border-y rounded-b border-web-gray flex items-center justify-between p-4'>
            <div className='flex gap-8'>
              <div className='flex gap-2 items-center'>
                <LocationIcon className='' /> <span>{repository.city}</span>
              </div>
              <div className='flex gap-2'>
                {repository?.topic?.map((topic, index) => {
                  return (
                    <div className='flex gap-1 items-center' key={index}>
                      <div className='bg-green w-4 h-4 rounded-full '></div> {topic}{' '}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='flex gap-2'>
              {repository.twitter && (
                <Link href={`https://twitter.com/${repository.twitter}`}>
                  <TwitterIcon className='w-5 h-5' />
                </Link>
              )}
              {repository.website && (
                <Link href={repository.website}>
                  <Chain className='w-5 h-5 fill-primary' />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HackathonCard;
