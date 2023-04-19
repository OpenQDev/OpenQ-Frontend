import React, { useContext, useEffect, useState } from 'react';
import { ChevronRightIcon, LocationIcon } from '@primer/octicons-react';
import Link from 'next/link';
import StoreContext from '../../store/Store/StoreContext';
import LoadingIcon from '../Loading/ButtonLoadingIcon';
import FlexScrollContainer from './FlexScrollContainer';

import upcomingHackathons from './upcomingHackathons.json';

upcomingHackathons.sort((a, b) => {
  const dateA = new Date(a[2]);
  const dateB = new Date(b[2]);
  return dateA - dateB;
});

export default function Newsletter() {
  const [appState] = useContext(StoreContext);
  const [email, setEmail] = useState(appState.accountData.email || '');
  const [isSending, setIsSending] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [renderDate, setRenderDate] = useState();
  useEffect(() => {
    setRenderDate(new Date());
  }, []);

  async function subscribeToNewsletter() {
    if (isEmailValid) {
      setIsSending(true);
      try {
        const formData = new FormData();
        formData.append('api_key', process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY);
        formData.append('email', email);

        const response = await fetch('https://api.convertkit.com/v3/forms/3697685/subscribe', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.error) {
          setIsError(true);
        } else {
          setIsSuccess(true);
        }
      } catch (err) {
        setIsError(true);
        appState.logger.error(err, appState.accountData.id, 'Explore/Newsletter.js1');
      } finally {
        setIsSending(false);
      }
    }
  }

  function handleEmailInputChange(e) {
    const mail = e.target.value;
    setEmail(mail);
    setIsEmailValid(appState.utils.emailRegex(mail));
  }

  return (
    <div className='sm:grid sm:grid-cols-2 sm:gap-6 md:gap-12 xl:gap-24 w-full pt-12 lg:pt-40'>
      <div className='pt-3'>
        <h1 className='text-center text-3xl lg:text-6xl sm:text-left'>Join upcoming web3 hackathons.</h1>
        <p className='text-center text-zinc-400 mt-3 sm:text-left lg:mt-6 lg:text-3xl'>
          Subscribe to our newsletter &amp; find out where to build next.
        </p>
        {isSuccess && (
          <p className='text-green-400 text-xl mt-6'>
            <span className='font-bold'>Success!</span> You&apos;ll receive updates on the latest hackathons.
          </p>
        )}
        {!isSuccess && (
          <div className='flex mt-5 mb-10 sm:mb-0'>
            <input
              type='email'
              placeholder='Email'
              className='border rounded-l-2xl w-full text-lg md:text-2xl bg-gray-300 text-gray-900 px-4 py-2 md:px-8 md:py-4 outline-none'
              value={email}
              disabled={isSending}
              onChange={handleEmailInputChange}
            />
            <button
              className={`${
                !isEmailValid && 'opacity-90 saturate-50'
              } transition-all bg-gradient-to-r from-cyan-300 to-green-400 !text-white text-lg md:text-2xl font-bold !rounded-r-2xl !rounded-l-none border-none md:!px-12 md:!py-4`}
              onClick={() => subscribeToNewsletter()}
              disabled={isSending || !isEmailValid}
            >
              {!isSending && <span>Subscribe</span>}
              {isSending && <LoadingIcon />}
            </button>
          </div>
        )}
        {isError && (
          <p className='text-red-400 text-xl mt-6'>
            <span className='font-bold'>Error!</span> Please try again later.
          </p>
        )}
      </div>

      <FlexScrollContainer className='mt-10 sm:mt-0'>
        <div className='flex flex-col space-y-3 sm:space-y-5 max-h-[50vh]'>
          {upcomingHackathons.map(([title, location, date, url]) => (
            <Link
              key={title + location + date}
              href={url}
              target='_blank'
              className='flex items-center justify-between border bg-dark-2 border-dark-1 rounded px-5 py-3 xl:px-8 xl:py-4'
            >
              <div className='flex flex-col w-5/6'>
                <div className='text-link-colour font-semibold sm:pr-3 truncate text-sm lg:text-xl'>{title}</div>
                <div className='text-gray-400 font-bold flex items-center space-x-1 whitespace-nowrap text-sm'>
                  <LocationIcon />
                  <span className='capitalize'>
                    {location},{' '}
                    {renderDate &&
                      new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className='flex items-center justify-center pl-3 sm:pl-5'>
                <ChevronRightIcon />
              </div>
            </Link>
          ))}
        </div>
      </FlexScrollContainer>
    </div>
  );
}
