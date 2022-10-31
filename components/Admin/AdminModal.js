import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import StoreContext from '../../store/Store/StoreContext';
import { ethers } from 'ethers';
import LinkText from '../svg/linktext';
import ModalDefault from '../Utils/ModalDefault';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import TweetAbout from '../Utils/TweetAbout';
import LoadingIcon from '../Loading/ButtonLoadingIcon';

const AdminModal = ({ setModal, modal, bounty }) => {
  const [token, setToken] = useState();
  const [volume, setVolume] = useState();
  const [appState] = useContext(StoreContext);

  useEffect(() => {
    if (modal.transaction && (modal.type === 'Budget' || modal.type === 'Payout')) {
      const tokenAddress = modal.transaction.events[0].args[1];
      const token = appState.tokenClient.getToken(tokenAddress);
      setToken(token);
      const volume = modal.transaction.events[0].args[2];
      let bigNumberVolume = ethers.BigNumber.from(volume.toString());
      let decimals = parseInt(token.decimals) || 18;
      let formattedVolume = ethers.utils.formatUnits(bigNumberVolume, decimals);
      setVolume(formattedVolume);
    }

    if (modal.transaction && modal.type === 'PayoutSchedule') {
      // do something?
    }
  }, [modal]);

  const createBudget = (bounty) => {
    return bounty?.fundingGoalTokenAddress
      ? {
          tokenAddress: bounty.fundingGoalTokenAddress,
          volume: bounty.fundingGoalVolume,
        }
      : null;
  };
  const budgetObj = useMemo(() => createBudget(bounty), [bounty]);
  const [budgetValues] = useGetTokenValues(budgetObj);
  const budget = budgetValues?.total;

  const createRewardSplit = (bounty) => {
    return bounty?.payoutTokenVolume
      ? {
          tokenAddress: bounty.payoutTokenAddress,
          volume: bounty.payoutTokenVolume,
        }
      : null;
  };
  const splitObj = useMemo(() => createRewardSplit(bounty), [bounty]);
  const [splitValue] = useGetTokenValues(splitObj);
  const split = splitValue?.total;

  const modalRef = useRef();
  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, modalRef]);

  const closeModal = () => {
    setModal(false);
  };
  const title = {
    ['Closed Split Price']: 'Split Price Contract Closed!',
    Budget: 'Budget Updated!',
    Payout: 'Payout Updated!',
    PayoutSchedule: 'Payout Schedule Updated!',
    Loading: modal.inProgress,
    Error: modal.title,
  };
  const content = {
    ['Closed Split Price']:
      'Split Price contract closed, no further claims will be available through this contract! \n\nCheck out the closing transaction with the link below for more information:',
    Budget: `The budget for this issue has been updated! \nCheck out your transaction with the link below:`,
    Payout: `The payout amount for this issue has been updated! \nCheck out your transaction with the link below:`,
    PayoutSchedule: `The payout schedule for this issue has been updated. \nCheck out your transaction with the link below:`,
    Error: modal.message,
  };
  const tweetText = {
    Budget: `💸 Just set a budget for an issue from ${bounty?.owner} on OpenQ, looking for devs to work on it: `,
    Payout: `💸 Just set a payout amount for an issue from ${bounty?.owner} on OpenQ, come get some rewards: `,
    PayoutSchedule: `💸 Just set a payout schedule for an issue from ${bounty?.owner} on OpenQ, looking for devs to work on it: `,
  };

  const btn =
    modal.type.includes('Closed') || modal.type === 'Error' || modal.type === 'Loading' ? (
      <button onClick={closeModal} className='btn-default'>
        <span>Close</span>
      </button>
    ) : (
      <TweetAbout tweetText={tweetText[modal.type]} bounty={bounty} />
    );

  return (
    <div ref={modalRef}>
      <ModalDefault title={title[modal.type]} footerRight={btn} setShowModal={setModal} resetState={setModal}>
        {(modal.type === 'Payout' || modal.type === 'Budget') && token && (
          <>
            <div className='gap-4 grid grid-cols-[150px_1fr]'>
              <div className='flex whitespace-pre-wrap col-span-2'>{content[modal.type]}</div>
              <div>{modal.type} set to:</div>
              <div className='flex gap-2'>
                <Image
                  width={24}
                  className='inline'
                  height={24}
                  src={token.path || token.logoURI || '/crypto-logos/ERC20.svg'}
                />
                <span>
                  {volume} {token.symbol}
                </span>
              </div>
              <div>Value: </div>
              <div>{appState.utils.formatter.format(modal.type === 'Budget' ? budget : split)}</div>
              <div className='flex-1' href={modal.transaction.transactionHash}>
                Transaction:
              </div>
              <a
                className='break-all flex-1 underline cursor-pointer'
                target='_blank'
                rel='noopener noreferrer'
                href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${modal.transaction.transactionHash}`}
              >
                {modal.transaction.transactionHash.slice(0, 3)}...
                {modal.transaction.transactionHash.slice(-3)}
                <LinkText />
              </a>
            </div>
          </>
        )}

        {modal.type === 'PayoutSchedule' && (
          <>
            <div className='gap-4 grid grid-cols-[200px_1fr]'>
              <div className='flex whitespace-pre-wrap col-span-2'>{content[modal.type]}</div>
              <div>Payout Schedule set to:</div>
              <div className='grid grid-cols-[120px_1fr] text-xs font-semibold leading-loose'>
                <div>Number of tiers:</div>
                <div>{modal.finalTierVolume.length}</div>

                {modal.finalTierVolume.map((t, index) => {
                  return (
                    <div key={index}>
                      <div>{`${appState.utils.handleSuffix(index + 1)} winner:`}</div>
                      <div className='self-center'>{t} %</div>
                    </div>
                  );
                })}
              </div>
              <div href={modal.transaction.transactionHash}>Transaction:</div>
              <a
                className='break-all flex-1 underline cursor-pointer'
                target='_blank'
                rel='noopener noreferrer'
                href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${modal.transaction.transactionHash}`}
              >
                {modal.transaction.transactionHash.slice(0, 3)}...
                {modal.transaction.transactionHash.slice(-3)}
                <LinkText />
              </a>
            </div>
          </>
        )}

        {modal.type === 'Loading' && (
          <>
            <div className='flex items-center gap-2'>
              Your request is being processed... <LoadingIcon />
            </div>
          </>
        )}

        {(modal.type.includes('Closed') || modal.type === 'Error') && (
          <>
            <div className='gap-4 grid grid-cols-[150px_1fr]'>
              <div className='pb-2 whitespace-pre-wrap col-span-2'>{content[modal.type]}</div>
              {modal.type !== 'Error' && (
                <>
                  <div className='flex-1' href={modal.transaction.transactionHash}>
                    Transaction:
                  </div>
                  <a
                    className='break-all flex-1 underline cursor-pointer'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL}/tx/${modal.transaction.transactionHash}`}
                  >
                    {modal.transaction.transactionHash.slice(0, 3)}...
                    {modal.transaction.transactionHash.slice(-3)}
                    <LinkText />
                  </a>
                </>
              )}
            </div>
          </>
        )}
      </ModalDefault>
    </div>
  );
};

export default AdminModal;
