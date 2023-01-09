// Third party
import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

// Custom
import useWeb3 from '../../../hooks/useWeb3';
import TokenFundBox from '../../TokenSelection/TokenFundBox';
import FundContext from '../FundStore/FundContext';
import StoreContext from '../../../store/Store/StoreContext';
import ToolTipNew from '../../Utils/ToolTipNew';
import BountyClosed from '../../BountyClosed';
import ApproveFundModal from '../ApproveFundModal';
import OrgDetails from '../../User/InvoicingDetailsTab/OrgDetails';
import { RESTING, CONFIRM, APPROVING, TRANSFERRING, APPROVE } from '../FundStore/ApproveFundState';
import useIsOnCorrectNetwork from '../../../hooks/useIsOnCorrectNetwork';
import SelectableNFT from '../../TokenSelection/SelectableNFT';
import NFTFundModal from '../../TokenSelection/NFTFundModal';
import Cross from '../../svg/cross';
import DepositPeriod from '../../TokenSelection/DepositPeriod';
import ConnectButton from '../../WalletConnect/ConnectButton';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';
import useFundBountyMethod from '../hooks/useFundBountyMethod';
import TokenContext from '../../TokenSelection/TokenStore/TokenContext';
import { shortenAddress } from '../../../services/utils/lib';

const FundPage = () => {
  const [fundState, fundDispatch] = useContext(FundContext);
  const { pickedNft, allowance, depositPeriodDays, nftTier, bounty, approveTransferState, setInternalMenu } = fundState;
  console.log(fundState);
  const web3 = useWeb3();
  const minter = bounty.issuer.id === web3?.account?.toLowerCase();
  const canCrowdFund = !bounty.invoiceable || bounty.bountyType === '0';
  const canFund = canCrowdFund || minter;
  const [volume, setVolume] = useState('');
  const [tokenSelectState] = useContext(TokenContext);
  const { token } = tokenSelectState;
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [setNftTier] = useState('');
  const [appState] = useContext(StoreContext);
  const fundBountyMethod = useFundBountyMethod();
  const { accountData, utils } = appState;
  const accountKeys = ['company', 'city', 'country', 'streetAddress', 'province', 'invoicingEmail'];
  const mustChangePayoutFirst = bounty.bountyType == '1' && bounty.payoutTokenVolume;

  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const [, tokenDispatch] = useContext(TokenContext);
  useEffect(() => {
    const depositTokenAddress = bounty?.deposits[0]?.tokenAddress;
    const payoutTokenAddress = bounty?.payoutTokenAddress;
    if (bounty?.bountyType == '1' && bounty?.deposits?.length > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(depositTokenAddress),
          address: depositTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
      fundDispatch(tokenAddressDispatch);
    } else if (bounty?.bountyType == '1' && bounty?.payoutTokenVolume > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(payoutTokenAddress),
          address: payoutTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
      fundDispatch(tokenAddressDispatch);
    }
  }, [bounty]);
  useEffect(() => {
    if (!(bounty?.bountyType == '1' && bounty?.deposits?.length > 0)) {
      const tokenDispatch = {
        type: 'SET_TOKEN',
        payload: token,
      };
      fundDispatch(tokenDispatch);
    }
  }, [token]);

  useEffect(() => {
    const volumeDispatch = {
      type: 'SET_VOLUME',
      payload: volume,
    };
    fundDispatch(volumeDispatch);
  }, [volume]);
  const hasInvoicingInfo = neededAccountData.length === 0 || !bounty.invoiceable;

  // Context
  const { openQClient } = appState;
  const { account, library } = web3;

  const clearNft = () => {
    const dispatch = {
      type: 'SET_NFT',
    };
    fundDispatch(dispatch);
  };

  // State
  const isContest = bounty.bountyType === '2' || bounty.bountyType === '3';

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

  // Methods
  const hasEnoughAllowance = async () => {
    const allowanceBigNumber = await openQClient.allowance(library, account, token.address, bounty.bountyAddress);
    const volumeInWei = volume * 10 ** token.decimals;
    const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));
    const allowanceValue =
      allowanceBigNumber > 0
        ? token.address != ethers.constants.AddressZero && allowanceBigNumber?.gte(bigNumberVolumeInWei)
        : 0;
    const allowanceDispatch = {
      type: 'SET_ALLOWANCE',
      payload: allowanceValue,
    };
    fundDispatch(allowanceDispatch);
  };

  const openFund = async () => {
    await hasEnoughAllowance();
    let dispatchPayload;
    if (allowance || token.address == ethers.constants.AddressZero) {
      dispatchPayload = {
        type: 'SET_APPROVE_TRANSFER_STATE',
        payload: CONFIRM,
      };
    } else {
      dispatchPayload = {
        type: 'SET_APPROVE_TRANSFER_STATE',
        payload: APPROVE,
      };
    }
    fundDispatch(dispatchPayload);
  };

  const fundBounty = async () => {
    fundBountyMethod();
  };

  function onVolumeChange(volume) {
    utils.updateVolume(volume, setVolume);
  }

  // Render
  return (
    <>
      {bounty.status == '1' ? (
        <>
          <BountyClosed bounty={bounty} />
        </>
      ) : (
        <div className='flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center'>
          {canFund ? (
            <div className='flex flex-col w-full space-y-5 pb-8 items-center md:border rounded-sm border-gray-700'>
              <div className='flex text-3xl w-full text-primary justify-center px-16 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm'>
                Escrow Funds in {utils.getBountyTypeName(bounty)} Contract
              </div>
              <div className='flex flex-col space-y-5 w-5/6 pt-2'>
                {!pickedNft ? (
                  <div className='flex w-full gap-4'>
                    <>
                      <TokenFundBox
                        onVolumeChange={onVolumeChange}
                        token={token}
                        volume={volume}
                        bounty={bounty}
                        mustChangePayoutFirst={mustChangePayoutFirst}
                        setInternalMenu={setInternalMenu}
                      />
                      <NFTFundModal />
                    </>
                  </div>
                ) : null}
                <div className='flex gap-4'>
                  <div className='w-full'>
                    <DepositPeriod />
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
                          <div className='text-center whitespace-nowrap w-full'>Fund</div>
                        </button>
                      </ToolTipNew>
                    )}
                  </div>
                  {pickedNft && (
                    <div className='w-60 relative -top-2 rounded-md '>
                      <SelectableNFT nft={pickedNft} />
                      <button
                        onClick={clearNft}
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
          ) : (
            <div>
              {' '}
              Sorry crowdfunding isn't avaliable for this bounty, please connect the account (
              {shortenAddress(bounty.issuer.id)}) that minted this bounty to fund it.
            </div>
          )}

          {approveTransferState !== RESTING && <ApproveFundModal confirmMethod={fundBounty} />}
        </div>
      )}
    </>
  );
};

export default FundPage;
