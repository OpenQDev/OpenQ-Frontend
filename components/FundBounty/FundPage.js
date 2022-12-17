// Third party
import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';

// Custom
import useWeb3 from '../../hooks/useWeb3';
import TokenFundBox from './SearchTokens/TokenFundBox';
import StoreContext from '../../store/Store/StoreContext';
import ToolTipNew from '../Utils/ToolTipNew';
import BountyClosed from '../BountyClosed/BountyClosed';
import ApproveFundModal from './ApproveFundModal';
import OrgDetails from '../User/InvoicingDetailsTab/OrgDetails';
import { RESTING, CONFIRM, APPROVING, TRANSFERRING, APPROVE } from './ApproveFundState';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import SelectableNFT from './SelectableNFT';
import NFTFundModal from './NFTFundModal.js';
import Cross from '../svg/cross';
import ConnectButton from '../WalletConnect/ConnectButton';
import fundBountyMethod from './fundBountyMethod';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { valueToDisplay, listWordsWithAnd } from '../../services/utils/lib';

const FundPage = ({ bounty, refreshBounty }) => {
  const [volume, setVolume] = useState('');
  const [depositPeriodDays, setDepositPeriodDays] = useState(30);
  const [error, setError] = useState('');
  const [buttonText, setButtonText] = useState('Fund');
  const [, setSuccessMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);
  const [approveTransferState, setApproveTransferState] = useState(RESTING);
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [allowance, setAllowance] = useState();
  const [pickedNft, setPickedNft] = useState();
  const [nftTier, setNftTier] = useState('');
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const accountKeys = ['company', 'city', 'country', 'streetAddress', 'province', 'invoicingEmail'];

  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });

  const hasInvoicingInfo = neededAccountData.length === 0 || !bounty.invoiceable;
  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  };
  // Context
  const { openQClient, utils } = appState;
  const web3 = useWeb3();
  const { account, library } = web3;

  // State
  const [token, setToken] = useState(zeroAddressMetadata);
  const isContest = bounty.bountyType === '2' || bounty.bountyType === '3';
  const bountyNames = new Map([
    ['0', 'Fixed Price Contract'],
    ['1', 'Split Price Contract'],
    ['2', 'Contest'],
    ['3', 'Fixed Contest'],
  ]);
  const bountyName = (type) => {
    return bountyNames.get(type) || 'Type unknown';
  };

  const onNftTierChange = (e) => {
    const targetedTier = parseInt(e.target.value);
    if ((targetedTier > 0 && targetedTier <= bounty.payoutSchedule.length) || e.target.value === '') {
      setNftTier(e.target.value);
    }
  };
  const disabledFundButton =
    approveTransferState == CONFIRM ||
    approveTransferState == APPROVING ||
    approveTransferState == TRANSFERRING ||
    bounty.status == '1' ||
    parseFloat(volume) <= 0.00000001 ||
    parseFloat(volume) > 1000000 ||
    (volume == '' && !pickedNft) ||
    (isContest && nftTier === '' && pickedNft) ||
    !(parseInt(depositPeriodDays) > 0) ||
    !hasInvoicingInfo;

  function resetState() {
    setApproveTransferState(RESTING);
  }

  // Methods

  const hasEnoughAllowance = async () => {
    const allowanceBigNumber = await openQClient.allowance(library, account, token.address, bounty.bountyAddress);
    const volumeInWei = volume * 10 ** token.decimals;
    const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));
    setAllowance(
      allowanceBigNumber > 0
        ? token.address != ethers.constants.AddressZero && allowanceBigNumber?.gte(bigNumberVolumeInWei)
        : 0
    );
  };

  const openFund = async () => {
    hasEnoughAllowance();
    setApproveTransferState(allowance || token.address == ethers.constants.AddressZero ? CONFIRM : APPROVE);
    setShowApproveTransferModal(true);
  };

  const closeModal = () => {
    setShowApproveTransferModal();
    setPickedNft();
  };

  const fundBounty = async () => {
    fundBountyMethod(
      setError,
      setApproveTransferState,
      volume,
      token,
      pickedNft,
      setButtonText,
      bounty,
      setShowApproveTransferModal,
      allowance,
      depositPeriodDays,
      setTransactionHash,
      setSuccessMessage,
      refreshBounty,
      error,
      appState,
      web3
    );
  };

  function onCurrencySelect(token) {
    setToken({ ...token, address: ethers.utils.getAddress(token.address) });
  }

  function onVolumeChange(volume) {
    utils.updateVolume(volume, setVolume);
  }
  const onDepositPeriodChanged = (e) => {
    if (parseInt(e.target.value) >= 0) setDepositPeriodDays(parseInt(e.target.value));
    if (e.target.value === '') setDepositPeriodDays('0');
  };

  // Render
  return (
    <>
      {bounty.status == '1' ? (
        <>
          <BountyClosed bounty={bounty} />
        </>
      ) : (
        <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center'>
          <div className='flex flex-col w-full space-y-5 pb-8 items-center md:border rounded-sm border-gray-700'>
            <div className='flex text-3xl w-full text-primary justify-center px-16 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm'>
              Escrow Funds in {bountyName(bounty.bountyType)}
            </div>
            <div className='flex flex-col space-y-5 w-5/6 pt-2'>
              {!pickedNft ? (
                <div className='flex w-full gap-4'>
                  <>
                    <TokenFundBox
                      onCurrencySelect={onCurrencySelect}
                      onVolumeChange={onVolumeChange}
                      token={token}
                      volume={volume}
                    />
                    <NFTFundModal setPickedNft={setPickedNft} />
                  </>
                </div>
              ) : null}
              <div className='flex gap-4'>
                <div className='w-full'>
                  <div className='flex w-full input-field-big mb-4'>
                    <div className=' flex items-center gap-3 w-full text-primary md:whitespace-nowrap'>
                      <ToolTipNew
                        relativePosition={'md:-left-12'}
                        outerStyles={'-top-1'}
                        groupStyles={''}
                        innerStyles={'whitespace-normal md:w-96 sm:w-60 w-40  '}
                        toolTipText={
                          'This is the number of days that your deposit will be in escrow. After this many days, your deposit will be fully refundable if the contract has still not been claimed.'
                        }
                      >
                        <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                          ?
                        </div>
                      </ToolTipNew>
                      <span>Deposit Locked Period</span>
                    </div>
                    <div className={'flex px-4 font-bold bg-input-bg'}>
                      <input
                        className='text-primary text-right number outline-none w-full flex-1 bg-input-bg'
                        autoComplete='off'
                        value={depositPeriodDays}
                        id='deposit-period'
                        onChange={onDepositPeriodChanged}
                      />
                    </div>
                  </div>

                  {isContest && pickedNft && (
                    <div className='flex w-full input-field-big mb-4'>
                      <div className=' flex items-center gap-3 w-full text-primary bg-input-bg md:whitespace-nowrap'>
                        <ToolTipNew
                          relativePosition={'md:-left-12'}
                          outerStyles={'-top-1'}
                          groupStyles={''}
                          innerStyles={'whitespace-normal md:w-96 sm:w-60 w-40  '}
                          toolTipText={
                            'Which tier of this contest do you want this nft to be funded to. Elgible tiers are '
                          }
                        >
                          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                            ?
                          </div>
                        </ToolTipNew>
                        <span>Tier</span>
                      </div>
                      <div className={'flex px-4 font-bold bg-input-bg'}>
                        <input
                          className='text-primary text-right number outline-none bg-input-bg w-full flex-1'
                          autoComplete='off'
                          value={nftTier}
                          id='deposit-period'
                          onChange={onNftTierChange}
                        />
                      </div>
                    </div>
                  )}
                  <ConnectButton needsGithub={false} nav={false} tooltipAction={'to fund this contract!'} />
                  {account && isOnCorrectNetwork && (
                    <ToolTipNew
                      relativePosition={'left-0'}
                      outerStyles={'-top-1 '}
                      groupStyles={'w-min'}
                      innerStyles={'sm:w-40 md:w-60 whitespace-normal'}
                      hideToolTip={!disabledFundButton}
                      toolTipText={
                        !(depositPeriodDays > 0)
                          ? "Please indicate how many days you'd like to fund your contract for."
                          : isContest && nftTier === '' && pickedNft
                          ? 'Please select an eligible tier to send the nft to.'
                          : !hasInvoicingInfo
                          ? 'This bounty requires invoicing information.'
                          : "Please indicate the volume you'd like to fund with. Must be between 0.0000001 and 1,000,000."
                      }
                    >
                      <button
                        className={`text-center px-8 w-min items-center py-0.5  ${
                          disabledFundButton ? 'btn-default w-full cursor-not-allowed' : 'btn-primary cursor-pointer'
                        } py-1.5`}
                        disabled={disabledFundButton}
                        type='button'
                        onClick={openFund}
                      >
                        <div className='text-center whitespace-nowrap w-full'>{buttonText}</div>
                      </button>
                    </ToolTipNew>
                  )}
                </div>
                {pickedNft && (
                  <div className='w-60 relative -top-2 rounded-md '>
                    <SelectableNFT nft={pickedNft} />
                    <button
                      onClick={() => setPickedNft()}
                      className='absolute top-3 right-3 bg-dark-mode hover:bg-black rounded-full p-1'
                    >
                      <Cross />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {bounty.invoiceable && (
              <>
                <div className='w-5/6'>
                  Invoicing data required for this bounty, you are missing values for the{' '}
                  {listWordsWithAnd(
                    neededAccountData.map((elem) => {
                      return valueToDisplay(elem);
                    })
                  )}{' '}
                  fields.
                </div>
                <details className='w-5/6 group' open={!hasInvoicingInfo}>
                  <summary className='list-none text-2xl text-muted fill-muted cursor-pointer'>
                    Invoicing data{' '}
                    <span className='group-open:hidden'>
                      <ChevronDownIcon size='24px' />
                    </span>
                    <span className='hidden group-open:inline'>
                      <ChevronUpIcon size='24px' />
                    </span>
                  </summary>
                  <OrgDetails slim={true} />
                </details>
              </>
            )}
          </div>

          {showApproveTransferModal && (
            <ApproveFundModal
              pickedNft={pickedNft}
              setPickedNft={setPickedNft}
              approveTransferState={approveTransferState}
              setApproveTransferState={setApproveTransferState}
              address={account}
              transactionHash={transactionHash}
              error={error}
              setShowApproveTransferModal={closeModal}
              confirmMethod={fundBounty}
              resetState={resetState}
              token={token}
              volume={volume}
              bountyAddress={bounty.bountyAddress}
              bounty={bounty}
              allowance={allowance}
              depositPeriodDays={depositPeriodDays}
            />
          )}
        </div>
      )}
    </>
  );
};

export default FundPage;
