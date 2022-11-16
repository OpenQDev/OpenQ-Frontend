import React from 'react';
import Image from 'next/image';

const OrganizationHeader = ({ organizationData }) => {
  return (
    <div className='px-4 pt-3 flex flex-wrap gap-6 w-full '>
      <div className='hidden sm:block'>
        <Image
          width={100}
          height={100}
          className='bg-active-gray rounded-sm  w-20 h-20'
          src={organizationData.avatarUrl}
          alt='avatar'
        />
      </div>
      <div className='flex-1 self-center'>
        <h1 className='text-2xl leading-condensed font-semibold'>{organizationData.name || organizationData.login}</h1>
        <p className='text-sm text-muted leading-[21px]'>
          <span>{organizationData?.description || ''}</span>
        </p>
        <ul className='inline-block text-sm mt-2'>
          {organizationData.location && (
            <li className='inline-block'>
              <div className='flex gap-1 mx-1'>
                <svg
                  aria-hidden='true'
                  height='16'
                  viewBox='0 0 16 16'
                  className='fill-primary'
                  version='1.1'
                  width='16'
                  data-view-component='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z'
                  ></path>
                </svg>
                <span className='text-xs'>{organizationData.location}</span>
              </div>
            </li>
          )}

          <li className='inline-block hover:underline'>
            <div className='flex gap-1 mx-1'>
              <svg
                aria-hidden='true'
                height='16'
                viewBox='0 0 16 16'
                version='1.1'
                width='16'
                data-view-component='true'
                className='fill-primary'
              >
                <path
                  fillRule='evenodd'
                  d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'
                ></path>
              </svg>
              <a href={organizationData.websiteUrl} className='text-xs'>
                {organizationData.websiteUrl}
              </a>
            </div>
          </li>
          {organizationData.twitterUsername && (
            <li className='inline-block hover:underline'>
              <div className='flex gap-1 mx-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 273.5 222.3'
                  role='img'
                  aria-labelledby='lzb78i9oiue5l6m8i5dzjc7743au9j8'
                  className='fill-primary'
                  height='16'
                  width='16'
                >
                  <title id='lzb78i9oiue5l6m8i5dzjc7743au9j8'>Twitter</title>
                  <path
                    d='M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1'
                    fill='currentColor'
                  ></path>
                </svg>

                <a
                  rel='nofollow'
                  itemProp='url'
                  className='text-xs'
                  href={`https://twitter.com/${organizationData.twitterUsername}`}
                >
                  @{organizationData.twitterUsername}
                </a>
              </div>
            </li>
          )}
          {organizationData.email && (
            <li className='inline-block hover:underline'>
              <div className='flex gap-1 mx-1'>
                <svg
                  aria-hidden='true'
                  height='16'
                  viewBox='0 0 16 16'
                  version='1.1'
                  width='16'
                  className='fill-primary'
                >
                  <path
                    fillRule='evenodd'
                    d='M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z'
                  ></path>
                </svg>
                <a rel='nofollow' itemProp='url' className='text-xs' href={`mailto:${organizationData.email}`}>
                  {organizationData.email}
                </a>
              </div>
            </li>
          )}
          <li className='inline-block hover:underline'>
            <div className='flex gap-1 mx-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                className='fill-primary'
              >
                <path
                  fillRule='evenodd'
                  d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'
                ></path>
              </svg>
              <a rel='nofollow' itemProp='url' className='text-xs' href={organizationData.url}>
                {organizationData.url}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationHeader;
