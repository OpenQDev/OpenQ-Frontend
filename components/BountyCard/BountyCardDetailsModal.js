// Third party
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import MiniDepositCard from '../Bounty/MiniDepositCard';
import BountyStatus from './BountyStatus';
import BountyLinks from './BountyLinks';
import useWeb3 from '../../hooks/useWeb3';
import BountyModalHeading from './BountyModalHeading';
import { StackIcon } from '@primer/octicons-react';
import TotalValue from '../Bounty/TotalValue';
import LabelsList from '../Bounty/LabelsList';
import ModalLarge from '../Utils/ModalLarge';
import useGetTokenValues from '../../hooks/useGetTokenValues';

const BountyCardDetailsModal = ({ bounty, closeModal, showModal, unWatchable, watchingState }) => {
  const modal = useRef();
  const { safe } = useWeb3();
  const [tokenValues] = useGetTokenValues(bounty.bountyTokenBalances);
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

  const footerLeft = <BountyLinks bounty={bounty} />;
  const btn = (
    <Link href={`/contract/${bounty.id}/${bounty.bountyAddress}`}>
      <div
        onClick={closeModal}
        target={safe ? '_self' : '_blank'}
        rel='noopener noreferrer'
        className='flex gap-2 items-center whitespace-nowrap btn-primary'
      >
        <StackIcon size={24} />
        Full Contract
      </div>
    </Link>
  );

  return (
    <>
      {showModal && (
        <ModalLarge
          title={
            <BountyModalHeading
              watchingState={watchingState}
              unWatchable={unWatchable}
              closeModal={closeModal}
              bounty={bounty}
            />
          }
          footerLeft={footerLeft}
          footerRight={btn}
          setShowModal={closeModal}
          resetState={closeModal}
        >
          <div className='w-full px-8 pt-2'>
            <BountyStatus bounty={bounty} />
          </div>
          <div className='w-full px-8'>
            <TotalValue bounty={bounty} price={tokenValues?.total} />
          </div>
          <div className=' w-full px-8 gap-4 flex'>
            <div className='w-full'>
              <div className=' text-muted pb-1 text-base w-full'>
                {!bounty?.prs?.some((pr) => pr.source?.__typename === 'PullRequest' && pr.source?.url)
                  ? 'No Pull Requests'
                  : 'Linked Pull Requests: '}
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
                            <Link href={pr.source.url} target='_blank' className={'underline'}>
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
          <div className=' w-full px-8'>
            <div className='pt-4 pb-1'>
              <LabelsList bounty={bounty} />
            </div>
          </div>

          <div className='font-semibold text-primary text-base px-8 my-2'>
            {fundedDeposits.length === 0 ? 'No active deposits.' : 'Deposits'}
          </div>
          {tokenValues && (
            <div className='flex flex-wrap gap-4 pb-6 items-center px-8'>
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
                >
                  <div onClick={closeModal} className='btn-default'>
                    more...
                  </div>
                </Link>
              )}
            </div>
          )}
          {bounty.bodyHTML && (
            <div className='flex text-lg text-muted px-8 pb-4'>
              <div className='flex flex-col w-full mt-2 p-4 border-web-gray border rounded-sm bg-dark-mode gap-2'>
                Issue content:
                <section className='markdown-body' dangerouslySetInnerHTML={{ __html: bounty.bodyHTML }}></section>
              </div>
            </div>
          )}
        </ModalLarge>
      )}
    </>
  );
};

export default BountyCardDetailsModal;
