// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import Image from 'next/image';
import { PersonAddIcon, PersonIcon, PeopleIcon } from '@primer/octicons-react';

// Children
import AddContestParams from './AddContestParams/AddContestParams';
import MintBountyInputIssue from './MintBountyInputIssue/MintBountyInputIssue';
import AddSplitPriceParams from './AddSplitPriceParams';
import Budgeting from './Budgeting';
import ErrorModal from './ErrorModal';
import InvoiceableToggle from './InvoiceableToggle';
import MintBountyModalButton from './MintBountyModalButton';
import TokenProvider from '../../FundBounty/TokenSelection/TokenStore/TokenProvider';

// Context
import StoreContext from '../../../store/Store/StoreContext';
import MintContext from '../MintContext';

// Utils
import SubMenu from '../../Utils/SubMenu';
import ModalLarge from '../../Utils/ModalLarge';

const MintBountyModal = ({ modalVisibility }) => {
  const [appState] = useContext(StoreContext);
  const [mintState, mintDispatch] = useContext(MintContext);

  // State
  const [issue, setIssue] = useState();
  const [error, setError] = useState();

  const { category, isLoading } = mintState;
  const handlieSetCategory = (category) => {
    const dispatch = {
      payload: category,
      type: 'SET_CATEGORY',
    };
    mintDispatch(dispatch);
  };

  const modal = useRef();

  const closeModal = () => {
    setIssue();
    setError();
    modalVisibility(false);

    const dispatch = {
      type: 'SET_LOADING',
      payload: false,
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
      href={'https://github.com/OpenQDev/OpenQ-Contracts/blob/production/contracts/Bounty/Implementations/BountyV2.sol'}
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
      {error ? (
        <ErrorModal setShowErrorModal={closeModal} error={error} />
      ) : (
        <ModalLarge
          title={`Deploy ${category} Contract`}
          footerLeft={footerLeft}
          footerRight={btn}
          setShowModal={modalVisibility}
          resetState={closeModal}
        >
          <div className='h-full grid grid-cols-[150px_1fr] gap-4'>
            <div className='pl-4 p-2 text-muted border-r border-gray-700'>
              <div className='pb-2'>Contract Type</div>
              <SubMenu
                items={[
                  { name: 'Fixed Price', Svg: PersonIcon },
                  { name: 'Split Price', Svg: PersonAddIcon },
                  { name: 'Contest', Svg: PeopleIcon },
                  { name: 'Fixed Contest', Svg: PeopleIcon },
                ]}
                internalMenu={category}
                updatePage={handlieSetCategory}
                styles={'justify-center'}
                vertical={true}
              />
            </div>
            <div className='overflow-y-auto px-2'>
              <h3 className='text-xl pt-2'>
                {category === 'Split Price'
                  ? 'Pay out a fixed amount to any contributors who submit work to this bounty, as many times as you like'
                  : `Create a${
                      category === 'Fixed price' ? 'n' : ''
                    } ${category} Contract to send funds to any GitHub issue`}
              </h3>
              <MintBountyInputIssue />
              <InvoiceableToggle />
              <TokenProvider>
                <Budgeting category={category} />{' '}
              </TokenProvider>

              {category === 'Split Price' ? (
                <>
                  <TokenProvider>
                    <AddSplitPriceParams />
                  </TokenProvider>
                </>
              ) : category === 'Contest' || category === 'Fixed Contest' ? (
                <>
                  <AddContestParams />
                </>
              ) : null}
            </div>
          </div>
        </ModalLarge>
      )}
    </>
  );
};

export default MintBountyModal;
