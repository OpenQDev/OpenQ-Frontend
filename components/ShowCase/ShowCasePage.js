import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import AuthContext from '../../store/AuthStore/AuthContext';

const ShowCasePage = ({ pr }) => {
  const [authState] = useContext(AuthContext);
  const { avatarUrl } = authState;
  const { isAddress } = ethers.utils;
  const [showForm, setShowForm] = useState();
  const [contributorData, setContributorData] = useState([]);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('Url not valid.');
  const [userId, setUserId] = useState();
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  /*const openContributorForm = () => {
    setShowForm(!showForm);
  };*/
  const getOffChainData = async () => {
    const result = await appState.openQPrismaClient.getPr(pr.id);
    if (result.pr) {
      const userResult = await appState.githubRepository.fetchUsersByIds(result.pr.contributorIds);
      const contributors = userResult.map((githubData) => {
        const address = result.pr.contributors.find((contributor) => contributor.userId === githubData.id);
        return { ...githubData, address };
      });
      setContributorData(contributors);
    }
  };

  useEffect(() => {
    try {
      getOffChainData();
    } catch (err) {
      appState.logger.error(err, accountData.id, 'ShowCasePage.js1');
    }
  }, []);
  const fetchGithub = async (e) => {
    const url = e.target.value;
    const validUrl = appState.utils.userUrlRegex(url);
    if (validUrl) {
      if (isAddress(address) || address.length === 0) {
        setError();
      } else {
        setError('Invalid address');
      }

      try {
        const result = await appState.githubRepository.fetchUserByUrl(url);
        const isNew = !contributorData.some((datum) => datum.id === result) && pr.author.id !== result;
        if (isNew) {
          setUserId(result);
        } else {
          setError('The user you are trying to add is already a contributor.');
        }
      } catch (err) {
        setError("The user you are trying to add doesn't exist.");
      }
    } else {
      setError('Not a valid user url.');
    }
  };

  const saveContributor = async () => {
    try {
      if (!error) {
        const result = await appState.openQPrismaClient.addContributor(pr.id, userId, address);
        if (result.addContributor) {
          setUserId();
          setAddress();
          setShowForm();

          try {
            await getOffChainData();
          } catch (err) {
            appState.logger.error(err, accountData.id, 'ShowCasePage.js2');
          }
        }
      }
    } catch (err) {
      appState.logger.error(err, accountData.id, 'ShowCasePage.js3');
    }
  };
  const isAuthor = avatarUrl?.includes(pr.author.avatarUrl.slice(0, 48));

  const removeContributor = async (e) => {
    const result = await appState.openQPrismaClient.removeContributor(pr.id, e.target.value);
    if (result.removeContributor) {
      try {
        await getOffChainData();
      } catch (err) {
        appState.logger.error(err, accountData.id, 'ShowCasePage.js4');
      }
    }
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
    if (isAddress(e) && error === 'Invalid Address') setError();
  };

  return (
    <div className='w-full'>
      <h1 className='lsm:text-[32px] text-4xl pt-16 pb-8 flex-1 leading-tight min-w-[240px] pr-20'>{pr.title}</h1>
      <a href={pr.url} className='text-tinted underline' target='_blank' rel='noopener noreferrer'>
        <span>View Source</span>
      </a>
      <div className='pt-8 text-lg'>
        {' '}
        <div className='markdown-body' dangerouslySetInnerHTML={{ __html: pr.bodyHTML }}></div>
      </div>

      <h3 className='flex gap-2 items-center'>
        <span className='py-1 text-xl pt-8 text-primary'>Contributor</span>{' '}
        {/*    {!showForm && isAuthor ? (
          <button onClick={openContributorForm}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 mt-2  stroke-web-gray hover:stroke-white'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>
        ) : null}*/}
      </h3>
      {showForm && (
        <div className='my-2'>
          <div className='flex content-center flex-wrap items-center gap-4'>
            <input
              onChange={fetchGithub}
              className='bg-dark-mode border border-web-gray p-2 rounded-full'
              placeholder='https://github.com/contributor-name'
            />
            <input
              onChange={handleAddress}
              className='bg-dark-mode border border-web-gray p-2 rounded-full'
              placeholder={'polygon address'}
              value={address}
            />

            <button onClick={saveContributor}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 stroke-web-gray hover:stroke-white'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setShowForm(false);
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 stroke-web-gray hover:stroke-white'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </button>
          </div>
          <span className='text-sm'>{error && <div>{error}</div>}</span>
        </div>
      )}
      <div className='py-2'>
        <div className='flex gap-2 h-6 text-primary'>
          <Link href={pr.author.url} target='_blank' rel='noopener norefferer'>
            <>
              <Image className='rounded-lg h-8' src={pr.author.avatarUrl} height={32} width={32} alt='avatar' />
            </>
          </Link>
          <div className='text-xl '>{pr.author.login}</div>
          {pr.author.twitterUsername && (
            <Link href={`https://twitter.com/${pr.author.twitterUsername}`} target='_blank' rel='noopener norefferer'>
              <>
                <Image width={24} height={24} src={'/social-icons/twitter.svg'} alt='twitter icon' />
              </>
            </Link>
          )}
        </div>
      </div>
      {contributorData.map((contributor, index) => {
        return (
          <div className='py-2 text-primary' key={index}>
            <div className='flex gap-2 h-6'>
              <Link href={contributor.url} target='_blank' rel='noopener norefferer'>
                <>
                  <Image className='rounded-lg' src={contributor.avatarUrl} height={32} width={32} alt='avatar' />
                </>
              </Link>
              <div className='text-xl '>{contributor.login}</div>
              {contributor.twitterUsername}
              {contributor.twitterUsername && (
                <div className='pt-1 cursor-pointer'>
                  <Link
                    href={`https://twitter.com/${contributor.twitterUsername}`}
                    target='_blank'
                    rel='noopener norefferer'
                  >
                    <>
                      <Image width={24} height={24} src={'/social-icons/twitter.svg'} alt='twitter icon' />
                    </>
                  </Link>
                </div>
              )}
              {isAuthor && (
                <button className='mt-1' value={contributor.id} onClick={removeContributor}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 stroke-muted hover:stroke-primary'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>{' '}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ShowCasePage;
