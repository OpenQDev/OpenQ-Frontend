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
import NFTFundModal from '../../TokenSelection/NFTFundModal';
import DepositPeriod from '../../TokenSelection/DepositPeriod';
import ConnectButton from '../../WalletConnect/ConnectButton';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { valueToDisplay, listWordsWithAnd } from '../../../services/utils/lib';
import useFundBountyMethod from '../hooks/useFundBountyMethod';
import TokenContext from '../../TokenSelection/TokenStore/TokenContext';
import { shortenAddress, getBountyTypeName } from '../../../services/utils/lib';
import { useRouter } from 'next/router';

const FundPage = () => {
  const [fundState, fundDispatch] = useContext(FundContext);
  const { allowance, depositPeriodDays, bounty, approveTransferState, setInternalMenu } = fundState;
  const web3 = useWeb3();
  const query = useRouter().query;
  const minter = bounty.issuer.id === web3?.account?.toLowerCase();
  const canCrowdFund = !(bounty.invoiceRequired || query.invoiceable) && !bounty.kycRequired;
  const canFund = canCrowdFund || minter;
  const [volume, setVolume] = useState('');
  const [tokenSelectState] = useContext(TokenContext);
  const { token } = tokenSelectState;
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();

  const [appState] = useContext(StoreContext);
  const fundBountyMethod = useFundBountyMethod();
  const { accountData, utils } = appState;
  const accountKeys = bounty.invoiceRequired
    ? ['company', 'city', 'country', 'streetAddress', 'province', 'invoicingEmail']
    : ['invoicingEmail'];
  const mustChangePayoutFirst =
    (bounty?.bountyType == '1' && bounty?.payoutTokenVolume > 0) ||
    (bounty?.bountyType == '3' && bounty?.payoutSchedule?.length > 0);
  const neededAccountData = accountKeys.filter((key) => {
    return !accountData[key];
  });
  const [, tokenDispatch] = useContext(TokenContext);
  useEffect(() => {
    const depositTokenAddress = bounty?.deposits[0]?.tokenAddress;
    const payoutTokenAddress = bounty?.payoutTokenAddress;
    if ((bounty?.bountyType == '1' || bounty?.bountyType == '3') && bounty?.deposits?.length > 0) {
      const tokenAddressDispatch = {
        type: 'SET_TOKEN',
        payload: {
          ...appState.tokenClient.getToken(depositTokenAddress),
          address: depositTokenAddress,
        },
      };
      tokenDispatch(tokenAddressDispatch);
      fundDispatch(tokenAddressDispatch);
    } else if (
      (bounty?.bountyType == '1' && bounty?.payoutTokenVolume > 0) ||
      (bounty?.bountyType == '3' && bounty?.payoutSchedule?.length > 0)
    ) {
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
    if (!((bounty?.bountyType == '1' || bounty?.bountyType == '3') && bounty?.deposits?.length > 0)) {
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
  const hasInvoicingInfo =
    neededAccountData.length === 0 || (!bounty.invoiceRequired && !bounty.supportingDocumentsRequired);

  // Context
  const { openQClient } = appState;
  const { account, library } = web3;

  const disabledFundButton =
    approveTransferState == CONFIRM ||
    approveTransferState == APPROVING ||
    approveTransferState == TRANSFERRING ||
    bounty.status == '1' ||
    parseFloat(volume) <= 0.00000001 ||
    parseFloat(volume) > 1000000 ||
    volume == '' ||
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
                Escrow Funds in {getBountyTypeName(bounty.bountyType)} Contract
              </div>
              <div className='flex flex-col space-y-5 w-5/6 pt-2'>
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
                <div className='flex gap-4'>
                  <div className='w-full'>
                    <DepositPeriod />

                    <ConnectButton needsGithub={false} nav={false} tooltipAction={'fund this contract!'} />
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
                            : !hasInvoicingInfo
                            ? 'This bounty requires invoicing information.'
                            : "Please indicate the volume you'd like to fund with. Must be between 0.0000001 and 1,000,000."
                        }
                      >
                        <button
                          className={`text-center px-8 w-min items-center py-0.5  ${
                            disabledFundButton
                              ? 'btn-default w-full cursor-not-allowed'
                              : 'btn-primary bg-green cursor-pointer'
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
                </div>
              </div>

              {(bounty.invoiceRequired || bounty.supportingDocumentsRequired) && (
                <>
                  {bounty.invoiceRequired && neededAccountData.length !== 0 ? (
                    <div className='w-5/6'>
                      Invoicing data required for this bounty, you are missing values for the{' '}
                      {listWordsWithAnd(
                        neededAccountData.map((elem) => {
                          return valueToDisplay(elem);
                        })
                      )}{' '}
                      fields.
                    </div>
                  ) : (
                    <></>
                  )}
                  <details className='w-5/6 group' open={!hasInvoicingInfo}>
                    <summary className='list-none text-2xl text-muted fill-muted cursor-pointer'>
                      {!bounty.invoiceRequired ? 'Contact Information' : 'Invoicing data'}
                      <span className='group-open:hidden'>
                        <ChevronDownIcon size='24px' />
                      </span>
                      <span className='hidden group-open:inline'>
                        <ChevronUpIcon size='24px' />
                      </span>
                    </summary>
                    <OrgDetails emailOnly={!bounty.invoiceRequired && bounty.supportingDocumentsRequired} slim={true} />
                  </details>
                  {!bounty.invoiceRequired && bounty.supportingDocumentsRequired && (
                    <div className='w-5/6 note'>
                      We will send the completed W8/W9 form with a link to accept to this email. Please note that only
                      your ethereum account is able to accept this. If someone else reviews the form you will need to
                      confirm it.
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className='p-8 sm:p-0'>
              Sorry crowdfunding isn't available for invoiceable bounties such as this one, please connect the account (
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
