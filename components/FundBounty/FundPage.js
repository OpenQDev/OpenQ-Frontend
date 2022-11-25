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
import InvoicingModal from './InvoicingModal';
import { RESTING, CONFIRM, APPROVING, TRANSFERRING, SUCCESS, ERROR, APPROVE } from './ApproveFundState';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';
import SelectableNFT from './SelectableNFT';
import NFTFundModal from './NFTFundModal.js';
import Cross from '../svg/cross';
import chainIdDeployEnvMap from '../../components/WalletConnect/chainIdDeployEnvMap';

const FundPage = ({ bounty, refreshBounty }) => {
  const [volume, setVolume] = useState('');
  const [depositPeriodDays, setDepositPeriodDays] = useState(30);
  const [error, setError] = useState('');
  const [buttonText, setButtonText] = useState('Fund');
  const [, setSuccessMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);
  const [approveTransferState, setApproveTransferState] = useState(RESTING);
  const [invoicingModal, setInvoicingModal] = useState();
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [allowance, setAllowance] = useState();
  const [pickedNft, setPickedNft] = useState();
  const [nftTier, setNftTier] = useState('');
  const zeroAddressMetadata = {
    name: 'Matic',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    chainId: 80001,
    path: 'https://wallet-asset.matic.network/img/tokens/matic.svg',
  };
  // Context
  const [appState, dispatch] = useContext(StoreContext);
  const { logger, openQClient, utils } = appState;
  const { library, account } = useWeb3();

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

  const closed = bounty.status == '1';
  const onNftTierChange = (e) => {
    const targetedTier = parseInt(e.target.value);
    if ((targetedTier > 0 && targetedTier <= bounty.payoutSchedule.length) || e.target.value === '') {
      setNftTier(e.target.value);
    }
  };
  const loadingClosedOrZero =
    approveTransferState == CONFIRM ||
    approveTransferState == APPROVING ||
    approveTransferState == TRANSFERRING ||
    closed ||
    parseFloat(volume) <= 0.00000001 ||
    parseFloat(volume) > 1000000 ||
    (volume == '' && !pickedNft) ||
    (isContest && nftTier === '' && pickedNft) ||
    !(parseInt(depositPeriodDays) > 0);

  const disableOrEnable = `${
    loadingClosedOrZero && account && isOnCorrectNetwork
      ? 'btn-default w-full cursor-not-allowed'
      : 'btn-primary cursor-pointer'
  }`;
  const fundButtonClasses = `text-center px-8 w-min items-center  ${disableOrEnable}`;

  function resetState() {
    setApproveTransferState(RESTING);
  }

  // Methods

  const isAllowed = async () => {
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
    isAllowed();
    setApproveTransferState(allowance || token.address == ethers.constants.AddressZero ? CONFIRM : APPROVE);
    setShowApproveTransferModal(true);
  };

  const closeModal = () => {
    setShowApproveTransferModal();
    setPickedNft();
  };

  const connectWallet = () => {
    const payload = {
      type: 'CONNECT_WALLET',
      payload: true,
    };
    dispatch(payload);
  };

  const openInvoicingModal = () => {
    setShowApproveTransferModal(false);
    setInvoicingModal(true);
  };
  async function fundBounty() {
    const volumeInWei = volume * 10 ** token.decimals;

    const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));

    let approveSucceeded = false;

    if (!pickedNft) {
      try {
        const isWhitelisted = await openQClient.isWhitelisted(library, token.address);

        // Only check bounty token address limit for non-whitelisted tokens
        if (!isWhitelisted) {
          const tokenAddressLimitReached = await openQClient.tokenAddressLimitReached(library, bounty.bountyAddress);
          if (tokenAddressLimitReached) {
            setError({
              title: 'Token Address Limit Is Reached!',
              message: 'Contact info@openq.dev',
            });
            setApproveTransferState(ERROR);
            return;
          }
        }
      } catch (error) {
        setError({
          title: 'Call Revert Exception',
          message: 'A contract call exception occurred. Please try again.',
        });
        setButtonText('Fund');
        setApproveTransferState(ERROR);
        return;
      }
      try {
        const callerBalance = await openQClient.balanceOf(library, account, token.address);

        if (callerBalance.noSigner) {
          setError({
            title: 'No wallet connected.',
            message: 'Please connect your wallet.',
          });
          setApproveTransferState(ERROR);
          return;
        } else if (callerBalance.lt(bigNumberVolumeInWei)) {
          setError({
            title: 'Funds Too Low',
            message: 'You do not have sufficient funds for this deposit',
          });
          setApproveTransferState(ERROR);
          return;
        }
      } catch (error) {
        logger.error(error, account, bounty.id);
        setError({
          title: 'Call Revert Exception',
          message: 'A contract call exception occurred. Please try again.',
        });
        setButtonText('Fund');
        setApproveTransferState(ERROR);
        return;
      }
      try {
        setShowApproveTransferModal(true);
        if (token.address != ethers.constants.AddressZero && !allowance) {
          setButtonText('Approving');
          setApproveTransferState(APPROVING);
          await openQClient.approve(library, bounty.bountyAddress, token.address, bigNumberVolumeInWei);
        }
        approveSucceeded = true;
      } catch (error) {
        const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
        setError({ message, title, link, linkText });
        setButtonText('Fund');
        setApproveTransferState(ERROR);
      }
      if (approveSucceeded || allowance) {
        setApproveTransferState(TRANSFERRING);
        try {
          const fundTxnReceipt = await openQClient.fundBounty(
            library,
            bounty.bountyAddress,
            token.address,
            bigNumberVolumeInWei,
            depositPeriodDays / (24 * 60 * 60)
          );
          setTransactionHash(fundTxnReceipt.events[0].transactionHash);
          setApproveTransferState(SUCCESS);
          setSuccessMessage(`Successfully funded issue ${bounty.url} with ${volume} ${token.symbol}!`);
          refreshBounty();
        } catch (error) {
          logger.error(error, account, bounty.id);
          const { message, title } = openQClient.handleError(error, {
            bounty,
          });
          setError({ message, title });
          setApproveTransferState(ERROR);
        }
        setButtonText('Fund');
      }
    } else {
      try {
        setShowApproveTransferModal(true);
        setButtonText('Approving');
        setApproveTransferState(APPROVING);

        await openQClient.approveNFT(library, bounty.bountyAddress, pickedNft.token_address, pickedNft.token_id);

        approveSucceeded = true;
        setApproveTransferState(TRANSFERRING);
      } catch (error) {
        const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
        setError({ message, title, link, linkText });
        setButtonText('Fund');
        setApproveTransferState(ERROR);
      }

      try {
        const { token_address, token_id } = pickedNft;
        const fundTxnReceipt = await openQClient.fundBountyWithNft(
          library,
          bounty.bountyAddress,
          token_address,
          token_id,
          depositPeriodDays
        );
        setTransactionHash(fundTxnReceipt.events[0].transactionHash);
        setApproveTransferState(SUCCESS);
        setButtonText('Fund');
        setSuccessMessage(
          `Successfully funded issue ${bounty.url} with ${pickedNft.name} #${pickedNft.token_id} (${pickedNft.metadata.name})${token.symbol}!`
        );
        refreshBounty();
      } catch (err) {
        const { message, title, link, linkText } = openQClient.handleError(error, { bounty });
        setError({ message, title, link, linkText });
        setButtonText('Fund');
        setApproveTransferState(ERROR);
      }
    }
  }

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

  const addOrSwitchNetwork = () => {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['params'],
      })
      .catch((err) => appState.logger.error(err, account));
  };

  // Render
  return (
    <>
      {closed ? (
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
                    <div className={'flex px-4 font-bold bg-dark-mode'}>
                      <input
                        className='text-primary text-right number outline-none bg-dark-mode w-full flex-1'
                        autoComplete='off'
                        value={depositPeriodDays}
                        id='deposit-period'
                        onChange={onDepositPeriodChanged}
                      />
                    </div>
                  </div>

                  {isContest && pickedNft && (
                    <div className='flex w-full input-field-big mb-4'>
                      <div className=' flex items-center gap-3 w-full text-primary md:whitespace-nowrap'>
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
                      <div className={'flex px-4 font-bold bg-dark-mode'}>
                        <input
                          className='text-primary text-right number outline-none bg-dark-mode w-full flex-1'
                          autoComplete='off'
                          value={nftTier}
                          id='deposit-period'
                          onChange={onNftTierChange}
                        />
                      </div>
                    </div>
                  )}
                  <ToolTipNew
                    relativePosition={'left-0'}
                    outerStyles={'-top-1 '}
                    groupStyles={'w-min'}
                    innerStyles={'sm:w-40 md:w-60 whitespace-normal'}
                    hideToolTip={account && isOnCorrectNetwork && !loadingClosedOrZero}
                    toolTipText={
                      account && isOnCorrectNetwork && !(depositPeriodDays > 0)
                        ? "Please indicate how many days you'd like to fund your contract for."
                        : account && isOnCorrectNetwork && isContest && nftTier === '' && pickedNft
                        ? 'Please select an elgible tier to fund the nft to.'
                        : account && isOnCorrectNetwork
                        ? "Please indicate the volume you'd like to fund with. Must be between 0.0000001 and 1,000,000."
                        : account
                        ? 'Please switch to the correct network to fund this contract.'
                        : 'Connect your wallet to fund this contract!'
                    }
                  >
                    <button
                      className={`${fundButtonClasses} py-1.5`}
                      disabled={loadingClosedOrZero && account && isOnCorrectNetwork}
                      type='button'
                      onClick={!account ? connectWallet : !isOnCorrectNetwork ? addOrSwitchNetwork : openFund}
                    >
                      <div className='text-center whitespace-nowrap w-full'>
                        {/* {account && isOnCorrectNetwork ? buttonText : 'Connect Wallet'} */}
                        {!account
                          ? 'Connect Wallet'
                          : !isOnCorrectNetwork
                          ? `Use ${chainIdDeployEnvMap[process.env.NEXT_PUBLIC_DEPLOY_ENV]['networkName']} Network`
                          : buttonText}
                      </div>
                    </button>
                  </ToolTipNew>
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
          </div>
          {invoicingModal && <InvoicingModal closeModal={() => setInvoicingModal(false)} bounty={bounty} />}
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
              openInvoicingModal={openInvoicingModal}
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
