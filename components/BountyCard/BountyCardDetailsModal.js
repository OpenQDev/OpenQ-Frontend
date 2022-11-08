// Third party
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import MiniDepositCard from '../Bounty/MiniDepositCard';
import BountyStatus from './BountyStatus';
import BountyLinks from './BountyLinks';
import useWeb3 from '../../hooks/useWeb3';
import BountyModalHeading from './BountyModalHeading';
import { LogIcon } from '@primer/octicons-react';
import TotalValue from '../Bounty/TotalValue';
import LabelsList from '../Bounty/LabelsList';
import CopyBountyAddress from '../Bounty/CopyBountyAddress';

const BountyCardDetailsModal = ({ bounty, closeModal, tokenValues, showModal, unWatchable, watchingState }) => {
  const modal = useRef();

  const { safe } = useWeb3();
  useEffect(() => {
    let didCancel;
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target) && showModal && !didCancel) {
        closeModal();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      didCancel = true;
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, showModal]);
  const fundedDeposits = bounty.deposits.filter((deposit) => {
    return deposit.refunded == false;
  });

  return (
    <div
      className={
        showModal
          ? 'flex flex-col justify-center w-full justify-items- items-center bg-overlay inset-0 fixed py-10 overflow-hidden z-30'
          : 'hidden'
      }
    >
      <div className='flex-col flex justify-center w-5/6 lg:w-2/3 max-w-3xl max-h-[calc(100vh-200px)]' ref={modal}>
        <div className='bg-dark-mode pt-2 rounded-sm-t text-lg relative sm:max-h-[calc(100vh-190px)]  overflow-auto'>
          <BountyModalHeading
            watchingState={watchingState}
            unWatchable={unWatchable}
            closeModal={closeModal}
            bounty={bounty}
          />

          <div className=' w-full px-8 gap-4 flex'>
            <div className='w-full'>
              <TotalValue bounty={bounty} price={tokenValues?.total} />
            </div>
            <div className='w-full mb-6'>
              <div className='font-semibold text-primary text-base w-full'>
                {!bounty?.prs?.some((pr) => pr.source?.__typename === 'PullRequest' && pr.source?.url) && 'No '}
                Linked Pull Requests
              </div>
              {bounty?.prs?.length > 0 && (
                <ul>
                  {bounty.prs
                    .filter((pr) => {
                      return pr.source?.['__typename'] === 'PullRequest' && pr.source?.url;
                    })
                    .map((pr, index) => {
                      if (pr.source?.['__typename'] === 'PullRequest' && pr.source?.url) {
                        return (
                          <li className='text-sm text-primary' key={index}>
                            <Link href={pr.source.url} target='_blank' className={'underline'} legacyBehavior>
                              {pr.source.title}
                            </Link>
                            <span>{pr.source.merged ? ' (merged)' : ' (not merged)'}</span>
                          </li>
                        );
                      }
                    })}
                </ul>
              )}
            </div>
          </div>
          <div className='w-full px-8 gap-4 -mt-4 flex flex-col sm:flex-row'>
            <BountyStatus bounty={bounty} />
            <div className='w-full'>
              <div className='font-semibold text-primary text-base my-3'>Smart Contract</div>
              <div className='flex flex-row space-x-2 text-primary text-base'>
                <div className='-mt-0.5'>
                  <CopyBountyAddress address={bounty.bountyAddress} />
                </div>
              </div>
            </div>
          </div>
          <div className=' w-full px-8'>
            <div className='pb-1'>
              <LabelsList bounty={bounty} />
            </div>
          </div>

          <div className='font-semibold text-primary text-base my-3 mx-4 sm:mx-8'>
            {fundedDeposits.length === 0 ? 'No active deposits.' : 'Deposits'}
          </div>
          {tokenValues && (
            <div className='flex flex-wrap gap-4 pb-6 items-end mx-4 sm:mx-8'>
              {fundedDeposits &&
                fundedDeposits
                  .sort((a, b) => {
                    return (
                      parseInt(a.receiveTime) +
                      parseInt(a.expiration) -
                      (parseInt(b.receiveTime) + parseInt(b.expiration))
                    );
                  })
                  .map((deposit, index) => (
                    <MiniDepositCard
                      key={index}
                      deposit={deposit}
                      status={bounty.status}
                      showLink={false}
                      id={bounty.id}
                    />
                  ))}
              {bounty.bountyTokenBalances?.length > 1 && (
                <Link
                  href={`/contract/${bounty.id}/${bounty.bountyAddress}`}
                  onClick={closeModal}
                  target={safe ? '_self' : '_blank'}
                  rel='noopener noreferrer'
                  legacyBehavior
                >
                  <div
                    onClick={closeModal}
                    className='border border-web-gray px-4 pb-1.5 pt-1.5 w-max rounded-md cursor-pointer'
                  >
                    more...
                  </div>
                </Link>
              )}
            </div>
          )}
          {bounty.bodyHTML && (
            <div className='flex flex-wrap mx-4 sm:mx-8 pb-4 text-primary'>
              <div className=' flex-1 w-full py-4 border-web-gray border px-2 rounded-sm'>
                <section className='markdown-body' dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}></section>
                <div className='py-4'>
                  <Link
                    href={`/contract/${bounty.id}/${bounty.bountyAddress}`}
                    onClick={closeModal}
                    target={safe ? '_self' : '_blank'}
                    rel='noopener noreferrer'
                    legacyBehavior
                  >
                    <div className='flex flex-row space-x-2 btn-default text-sm w-fit items-center'>
                      <LogIcon size={16} />
                      <div>Read more</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='bg-black w-5/6  lg:w-2/3 max-w-3xl overflow-hidden rounded-b-sm p-4'>
          <BountyLinks bounty={bounty} />
        </div>
      </div>
    </div>
  );
};

export default BountyCardDetailsModal;
