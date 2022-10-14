// Third party
import React, { useState, useContext, useEffect } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import { ethers } from 'ethers';

// Custom
import StoreContext from '../../store/Store/StoreContext';
import DepositCard from './DepositCard';
import ToolTipNew from '../Utils/ToolTipNew';
import BountyClosed from '../BountyClosed/BountyClosed';
import useEns from '../../hooks/useENS';
import ApproveTransferModal from './ApproveTransferModal';
import { RESTING, CONFIRM, APPROVING, SUCCESS, ERROR } from './ApproveTransferState';
import useIsOnCorrectNetwork from '../../hooks/useIsOnCorrectNetwork';

const RefundPage = ({ bounty, refreshBounty, internalMenu }) => {
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isOnCorrectNetwork] = useIsOnCorrectNetwork();
  const [approveTransferState, setApproveTransferState] = useState(RESTING);
  const [showApproveTransferModal, setShowApproveTransferModal] = useState(false);
  const [extend, setExtend] = useState(false);
  const [depositPeriodDays, setDepositPeriodDays] = useState({});

  const onDepositPeriodChanged = (e) => {
    if (parseInt(e.target.value) >= 0)
      setDepositPeriodDays({
        ...depositPeriodDays,
        [e.target.name]: parseInt(e.target.value),
      });
    if (e.target.value === '') setDepositPeriodDays({ ...depositPeriodDays, [e.target.name]: '0' });
  };

  // Context
  const [appState] = useContext(StoreContext);
  const { library, account } = useWeb3();
  const [ensName] = useEns(account);

  const closed = bounty.status == '1';

  // Side Effects
  useEffect(() => {
    if (bounty) {
      setConfirmationMessage(
        `You are about to refund your deposits on issue ${bounty.url} to the address ${
          ensName || account
        }. Is this correct ?`
      );
    }
  }, [bounty]);

  const resetState = () => {
    setShowApproveTransferModal(false);
    setApproveTransferState(CONFIRM);
  };

  // Methods
  async function refundBounty() {
    setApproveTransferState(APPROVING);
    const depositId = showApproveTransferModal;

    try {
      const txnReceipt = await appState.openQClient.refundDeposit(library, bounty.bountyAddress, depositId);
      setTransactionHash(txnReceipt.events[0].transactionHash);

      try {
        setApproveTransferState(SUCCESS);
        refreshBounty();
      } catch (err) {
        appState.logger.error(err, account, bounty.id);
      }
    } catch (error) {
      const { message, title } = appState.openQClient.handleError(error, {
        account,
        bounty,
      });
      setError({ message, title });
      setApproveTransferState(ERROR);
    }
  }

  async function extendBounty() {
    setApproveTransferState(APPROVING);
    const depositId = showApproveTransferModal;

    try {
      const txnReceipt = await appState.openQClient.extendDeposit(
        library,
        bounty.bountyAddress,
        depositId,
        depositPeriodDays[depositId]
      );
      setTransactionHash(txnReceipt.events[0].transactionHash);

      try {
        setApproveTransferState(SUCCESS);
        refreshBounty();
      } catch (err) {
        appState.logger.error(err, account, bounty.id);
      }
    } catch (err) {
      const { message, title } = appState.openQClient.handleError(err, {
        account,
        bounty,
      });
      setError({ message, title });
      setApproveTransferState(ERROR);
    }
  }
  // Render

  return (
    <>
      {closed && bounty.bountyType === '0' ? (
        <>{internalMenu === 'Refund' && <BountyClosed bounty={bounty} />}</>
      ) : (
        <div
          className={`flex flex-1 pt-4 pb-8 w-full max-w-[1200px] justify-center ${
            internalMenu !== 'Refund' ? 'hidden' : null
          }`}
        >
          <div className='flex flex-col space-y-2 items-center w-full md:border rounded-sm border-gray-700 text-primary'>
            <h1 className='flex w-full text-3xl justify-center px-12 py-4 md:bg-[#161b22] md:border-b border-gray-700 rounded-t-sm'>
              Your Deposits
            </h1>
            <div className='flex flex-col space-y-5 w-full px-8 pt-2'>
              <div className=' text-center'>To see your deposits, connect the wallet that funded them.</div>
              <h2 className='text-2xl border-b border-gray-700 pb-4 flex contents-center items-center gap-4'>
                <span>{closed && 'Partially'} Refundable</span>
                <span>
                  <ToolTipNew
                    innerStyles={'w-48 whitespace-normal'}
                    mobileX={10}
                    toolTipText={
                      'This contract is already closed, if claims have been made on this competition, you may not be able to refund your deposit.'
                    }
                  >
                    <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square text-sm leading-4 h-4 box-content text-center font-bold text-primary'>
                      ?
                    </div>
                  </ToolTipNew>
                </span>
              </h2>
              <div className='lg:grid lg:grid-cols-[1fr_1fr] gap-4 pb-5'>
                {bounty.deposits &&
                  bounty.deposits
                    .filter((deposit) => {
                      return ethers.utils.getAddress(deposit.sender.id) == account;
                    })
                    .filter((deposit) => {
                      return deposit.refunded == false;
                    })
                    .filter((deposit) => {
                      return (
                        parseInt(deposit.receiveTime) + parseInt(deposit.expiration) < Math.floor(Date.now() / 1000)
                      );
                    })
                    .map((deposit) => {
                      return (
                        <div key={deposit.id}>
                          <DepositCard
                            deposit={deposit}
                            status='refundable'
                            closed={closed}
                            bounty={bounty}
                            onDepositPeriodChanged={onDepositPeriodChanged}
                            depositPeriodDays={depositPeriodDays[deposit.id]}
                            refundBounty={() => {
                              setConfirmationMessage(
                                `You are about to refund the bounty at ${bounty.bountyAddress.substring(
                                  0,
                                  12
                                )}...${bounty.bountyAddress.substring(32)}	Are you sure you want to refund this deposit?`
                              );
                              setExtend(false);
                              setApproveTransferState(CONFIRM);
                              setShowApproveTransferModal(deposit.id);
                            }}
                            extendBounty={(id, formattedVolume, tokenSymbol) => {
                              setConfirmationMessage(
                                `You are about to relock this deposit at ${bounty.bountyAddress.substring(
                                  0,
                                  12
                                )}...${bounty.bountyAddress.substring(32)} for ${depositPeriodDays[deposit.id]} ${
                                  depositPeriodDays[deposit.id] == 1 ? 'day' : 'days'
                                }.	Are you sure you want to relock this deposit?
                                You will be able to refund your deposit of ${formattedVolume} ${tokenSymbol} on ${appState.utils.formatUnixDate(
                                  parseInt(Date.now() / 1000) + depositPeriodDays[deposit.id] * 60 * 60 * 24
                                )}`
                              );
                              setExtend(true);
                              setApproveTransferState(CONFIRM);
                              setShowApproveTransferModal(deposit.id);
                            }}
                            isOnCorrectNetwork={isOnCorrectNetwork}
                          />
                        </div>
                      );
                    })}
              </div>
              <h2 className='text-2xl border-b border-gray-700 pb-4'>Not Yet Refundable</h2>
              <div className='grid lg:grid-cols-[1fr_1fr] gap-4 pb-5'>
                {bounty.deposits &&
                  bounty.deposits
                    .filter((deposit) => {
                      return ethers.utils.getAddress(deposit.sender.id) == account;
                    })
                    .filter((deposit) => {
                      return (
                        parseInt(deposit.receiveTime) + parseInt(deposit.expiration) > Math.floor(Date.now() / 1000)
                      );
                    })
                    .map((deposit) => {
                      return (
                        <div key={deposit.id}>
                          <DepositCard
                            deposit={deposit}
                            closed={closed}
                            status='not-yet-refundable'
                            bounty={bounty}
                            onDepositPeriodChanged={onDepositPeriodChanged}
                            depositPeriodDays={depositPeriodDays[deposit.id]}
                            extendBounty={(id, formattedVolume, tokenSymbol) => {
                              setConfirmationMessage(
                                `You are about to extend this deposit's lock period at ${bounty.bountyAddress.substring(
                                  0,
                                  12
                                )}...${bounty.bountyAddress.substring(32)} by ${depositPeriodDays[deposit.id]} ${
                                  depositPeriodDays[deposit.id] == 1 ? 'day' : 'days'
                                }.	Are you sure you want to extend this deposit?
                                You will be able to refund your deposit of ${formattedVolume} ${tokenSymbol} on ${appState.utils.formatUnixDate(
                                  parseInt(deposit.receiveTime) +
                                    parseInt(deposit.expiration) +
                                    parseInt(depositPeriodDays[deposit.id] * 60 * 60 * 24)
                                )}`
                              );
                              setExtend(true);
                              setApproveTransferState(CONFIRM);
                              setShowApproveTransferModal(deposit.id);
                            }}
                            isOnCorrectNetwork={isOnCorrectNetwork}
                          />
                        </div>
                      );
                    })}
              </div>
              <h2 className='text-2xl border-b border-gray-700 pb-4'>Refunded</h2>
              <div className='grid lg:grid-cols-[1fr_1fr] gap-4 pb-5'>
                {bounty.deposits &&
                  bounty.deposits
                    .filter((deposit) => {
                      return ethers.utils.getAddress(deposit.sender.id) == account;
                    })
                    .filter((deposit) => {
                      return deposit.refunded == true;
                    })
                    .map((deposit) => {
                      return (
                        <div key={deposit.id}>
                          <DepositCard
                            deposit={deposit}
                            status='refunded'
                            bounty={bounty}
                            refundBounty={refundBounty}
                          />
                        </div>
                      );
                    })}
              </div>
            </div>
            {showApproveTransferModal && (
              <ApproveTransferModal
                approveTransferState={approveTransferState}
                transactionHash={transactionHash}
                confirmationMessage={confirmationMessage}
                error={error}
                setShowApproveTransferModal={setShowApproveTransferModal}
                positiveOption={!extend ? 'Yes, Refund!' : 'Yes, Extend!'}
                confirmMethod={!extend ? refundBounty : extendBounty}
                resetState={resetState}
                approvingMessage={!extend ? 'Refunding...' : 'Extending...'}
                approvingTitle={!extend ? 'Refund' : 'Extend'}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default RefundPage;
