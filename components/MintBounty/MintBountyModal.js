// Third party
import React, { useEffect, useState, useContext, useRef } from 'react';
import Image from 'next/image';
import { PersonAddIcon, PersonIcon, PeopleIcon } from '@primer/octicons-react';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import Invoicing from './Invoicing';
import Budgeting from './Budgeting';
import MintBountyModalButton from './MintBountyModalButton';
import ErrorModal from './ErrorModal';
import AddSplitPriceParams from './AddSplitPriceParams';
import SubMenu from '../Utils/SubMenu';
import ModalLarge from '../Utils/ModalLarge';
import AddContestParams from './AddContestParams';
import MintBountyInputIssue from './MintBountyInputIssue';
import MintProvider from './MintProvider';

const MintBountyModal = ({ modalVisibility, types }) => {
  // Context
  const [appState] = useContext(StoreContext);
  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  };
  // State
  const hideModalState = useState();
  const [issue, setIssue] = useState();
  const [url, setUrl] = useState('');
  const [bountyAddress, setBountyAddress] = useState();
  const isLoadingState = useState();
  const [error, setError] = useState();
  const [closed, setClosed] = useState();
  const [enableMint, setEnableMint] = useState();
  const isValidUrl = appState.utils.issurUrlRegex(url);
  const [currentSum] = useState(0);

  // state instances to pass
  const finalTierVolumesState = useState([1, 1, 1]);
  const payoutVolumeState = useState('');
  const payoutTokenState = useState(zeroAddressMetadata);
  const enableRegistrationState = useState(false);
  const registrationDeadlineState = useState();
  const startDateState = useState();
  console.log(enableMint, 'enableMint');

  // get values from state instances
  const [isLoading, setIsLoading] = isLoadingState;

  const initialCategory =
    types[0] === '1'
      ? 'Split Price'
      : types[0] === '2'
      ? 'Contest'
      : types[0] === '3'
      ? 'Fixed Contest'
      : 'Fixed Price';
  const [category, setCategory] = useState(initialCategory);
  // const [template, setTemplate] = useState('');
  const sumState = useState(0);
  const [sum] = sumState;

  // logic if smart contract adjusted: const tierConditions = tier == 0 || (tier > 0 && sum == 100) || tier == '' || tier == undefined
  // and tooltip text: 'Please make sure the number of tiers is set to 0 OR the sum of percentages adds up to 100.'

  // Refs
  const modal = useRef();

  const setIssueUrl = async (issueUrl) => {
    if (!isLoading) {
      setEnableMint();
      let didCancel = false;
      setUrl(issueUrl);
      let issueUrlIsValid = appState.utils.issurUrlRegex(issueUrl);
      if (issueUrlIsValid && !didCancel) {
        async function fetchIssue() {
          try {
            const data = await appState.githubRepository.fetchIssueByUrl(issueUrl);
            if (!didCancel) {
              setIssue(data);
            }
            return data;
          } catch (error) {
            if (!didCancel) {
              setIssue(false);
            }
          }
        }
        const issueData = await fetchIssue();
        if (issueData) {
          try {
            console.log(bounty);
            let bounty = await appState.openQSubgraphClient.getBountyByGithubId(issueData.id);
            if (closed === false && bounty?.status == '1' && didCancel) {
              setClosed(true);
            }
            if (!didCancel && closed === true && bounty?.status !== '1') {
              setClosed(false);
            }
            if (bounty && !didCancel) {
              setBountyAddress(bounty.bountyAddress);
            } else {
              if (!didCancel) {
                console.log('exec');
                setEnableMint(true);
                setBountyAddress();
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
      return () => {
        didCancel = true;
      };
    }
  };

  const closeModal = () => {
    setIssue();
    setUrl();
    setBountyAddress();
    setIsLoading();
    setError();
    modalVisibility(false);
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
      href={'https://github.com/OpenQDev/OpenQ-Contracts/blob/production/contracts/Bounty/Implementations/BountyV1.sol'}
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

  const btn = !error && (
    <MintBountyModalButton
      issue={issue}
      enableMint={enableMint}
      isLoadngState={isLoadingState}
      currentSum={currentSum}
      sum={sum}
      payoutVolumeState={payoutVolumeState}
      sumState={sumState}
      finalTierVolumesState={finalTierVolumesState}
      category={category}
      enableRegistrationState={enableRegistrationState}
      registrationDeadlineState={registrationDeadlineState}
      startDateState={startDateState}
      payoutTokenState={payoutTokenState}
      hideModalState={hideModalState}
      modalVisibility={modalVisibility}
      setError={setError}
    />
  );

  // Render
  return (
    <MintProvider>
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
                updatePage={setCategory}
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
              <MintBountyInputIssue
                setIssueUrl={setIssueUrl}
                issueData={issue}
                url={url}
                isValidUrl={isValidUrl}
                bountyAddress={bountyAddress}
                closed={closed}
              />

              <Invoicing />
              <Budgeting category={category} />

              {category === 'Split Price' ? (
                <>
                  <AddSplitPriceParams payoutTokenState={payoutTokenState} payoutVolumeState={payoutVolumeState} />
                </>
              ) : category === 'Contest' || category === 'Fixed Contest' ? (
                <>
                  <AddContestParams
                    sumState={sumState}
                    finalTierVolumesState={finalTierVolumesState}
                    category={category}
                    enableRegistrationState={enableRegistrationState}
                    registrationDeadlineState={registrationDeadlineState}
                    startDateState={startDateState}
                    payoutTokenState={payoutTokenState}
                    hideModalState={hideModalState}
                  />
                </>
              ) : null}
            </div>
          </div>
        </ModalLarge>
      )}
    </MintProvider>
  );
};

export default MintBountyModal;
