// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PersonIcon, PeopleIcon } from '@primer/octicons-react';

// Children
import AddContestParams from '../AddContestParams';
import MintBountyInputIssue from '../MintBountyInputIssue/MintBountyInputIssue';
import Budgeting from '../Budgeting';
import ErrorModal from '../ErrorModal';
import InvoiceableToggle from '../InvoiceRequired';
import MintBountyModalButton from '../MintBountyModalButton';
import TokenProvider from '../../../TokenSelection/TokenStore/TokenProvider';
import AddAlternativeMetadata from '../AddAlternativeMetadata';

// Context
import StoreContext from '../../../../store/Store/StoreContext';
import MintContext from '../../MintContext';

// Utils
import SubMenu from '../../../Utils/SubMenu';
import ModalLarge from '../../../Utils/ModalLarge';
import KycRequiredToggle from '../KycRequiredToggle';
import W8RequiredToggle from '../W8RequiredToggle';
import { getBountyTypeName, getTypeFromCategory } from '../../../../services/utils/lib';
import useWeb3 from '../../../../hooks/useWeb3';

const MintBountyModal = ({ modalVisibility }) => {
  const [appState] = useContext(StoreContext);
  const [mintState, mintDispatch] = useContext(MintContext);
  const { gnosisSafe } = useWeb3();

  // State
  const [issue, setIssue] = useState();
  const [error, setError] = useState();

  const { type, isLoading } = mintState;

  const handleSetCategory = (category) => {
    const dispatch = {
      payload: getTypeFromCategory(category) || 0,
      type: 'SET_TYPE',
    };
    mintDispatch(dispatch);
  };

  const modal = useRef();

  const closeMintModal = () => {
    setIssue();
    setError();
    modalVisibility(false);

    const dispatch = {
      type: 'SET_LOADING',
      payload: false,
    };
    mintDispatch(dispatch);
  };

  const closeErrorModal = () => {
    setError();

    const dispatch = {
      type: 'SET_LOADING',
      payload: false,
    };
    mintDispatch(dispatch);
  };

  const setAccepted = (e) => {
    const accepted = e.target.checked;
    const dispatch = {
      type: 'SET_ACCEPTED',
      payload: accepted,
    };
    mintDispatch(dispatch);
  };

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (
        modal.current &&
        !modal.current.contains(event.target) &&
        !appState.walletConnectModal &&
        !document.getElementById('connect-modal')?.contains(event.target)
      ) {
        modalVisibility(false);
      }
    }

    // Bind the event listener
    if (!isLoading) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, isLoading]);

  // Methods

  const footerLeft = (
    <a
      href={'https://github.com/OpenQDev/OpenQ-Contracts/tree/production/contracts/Bounty/Implementations'}
      className='flex gap-2 underline'
      target='_blank'
      rel='noreferrer'
    >
      <>
        <Image src={'/social-icons/github-logo-white.svg'} width={24} height={24} alt='github-logo' />
        Contract source code
      </>
    </a>
  );

  const btn = !error && <MintBountyModalButton issue={issue} modalVisibility={modalVisibility} setError={setError} />;

  // Render
  return (
    <>
      {error && (
        <>
          <ErrorModal setShowErrorModal={closeErrorModal} error={error} />
          <div className='bg-overlay z-[52] fixed inset-0'></div>
        </>
      )}
      <ModalLarge
        title={`Deploy ${getBountyTypeName(type)} Contract`}
        footerLeft={footerLeft}
        footerRight={btn}
        setShowModal={modalVisibility}
        resetState={closeMintModal}
        error={error}
      >
        <div className='h-full grid grid-cols-[150px_1fr] gap-4'>
          <div className='pl-4 p-2 text-muted border-r border-gray-700'>
            <div className='pb-2'>Contract Type</div>
            <SubMenu
              items={[
                { name: 'Fixed Price', Svg: PersonIcon },
                { name: 'Hackathon', Svg: PeopleIcon },
              ]}
              internalMenu={getBountyTypeName(type)}
              updatePage={handleSetCategory}
              styles={'justify-center'}
              vertical={true}
            />
          </div>
          <div className='overflow-y-auto px-2'>
            <h3 className='text-xl pt-2'>
              Create a {getBountyTypeName(type)} Contract to send funds to any GitHub issue
            </h3>
            <MintBountyInputIssue />
            {type === 3 && (
              <>
                <InvoiceableToggle />
                <KycRequiredToggle />
                <W8RequiredToggle />
              </>
            )}
            <TokenProvider>
              <Budgeting />{' '}
            </TokenProvider>

            {type === 2 || type === 3 ? (
              <>
                <AddContestParams />
              </>
            ) : null}
            <AddAlternativeMetadata />
            <div className='flex items-center gap-2 pb-4 font-semibold'>
              I accept the{''}
              <Link className='underline' href={'/terms-of-use'}>
                terms of use
              </Link>
              <input
                aria-label='accept terms of service'
                type='checkbox'
                className='checkbox'
                onChange={setAccepted}
              ></input>
            </div>
            {gnosisSafe && (
              <div className='note'>
                Hey! Looks like you are using gnosis safe via wallet connect. Because gnosis safes' often require
                multiple signatures, this modal will will be stuck in a pending state. Once you're multi-sig has
                approved the transaction, please reload the app, and you'll see the results of your transaction.
              </div>
            )}
          </div>
        </div>
      </ModalLarge>
    </>
  );
};

export default MintBountyModal;
