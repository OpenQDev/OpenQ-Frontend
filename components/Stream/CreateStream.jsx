import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import useWeb3 from '../../hooks/useWeb3';
import ApproveStreamModal from './ApproveStreamModal';
import { APPROVING, ERROR, SUCCESS, TRANSFERRING } from './ApproveTransferState';
import FundStreamModal from './FundStreamModal';
import { ethers } from 'ethers';
import TokenProvider from '../TokenSelection/TokenStore/TokenProvider';

const CreateStream = () => {
  // CONTEXT
  const [appState] = useContext(StoreContext);
  const { logger, superfluidClient, openQClient } = appState;
  const [txnHash, setTxnHash] = useState('');
  const [error, setError] = useState({});
  const { account, library } = useWeb3();

  // STATE
  const [showModal, setShowModal] = useState('');
  const [approveTransferState, setApproveTransferState] = useState('CONFIRM');

  const initialToken = {
    token: {
      name: 'Dai',
      address: '0xB221D2E203F9e71E3a5cE0a745A6A9e890d8ED50',
      symbol: 'DAI',
      decimals: 18,
      chainId: 80001,
      path: '/crypto-logos/DAI.svg',
    },
  };

  async function fund(volume, token) {
    try {
      setApproveTransferState(APPROVING);
      const tx = await superfluidClient.approve(library, token.address, volume.toString());
      await superfluidClient.upgradeToken(library, token.address, volume.toString());
      setTxnHash(tx.hash);
      setApproveTransferState(SUCCESS);
    } catch (err) {
      logger.error(err, account);
      setApproveTransferState(ERROR);
      const { message, title } = openQClient.handleError(error);
      setError({ message, title });
    }
  }
  async function approveToken(volume, recipient, flowRate, type, token) {
    const volumeInWei = volume * 10 ** token.decimals;
    const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toLocaleString('fullwide', { useGrouping: false }));
    const callerBalance = await openQClient.balanceOf(library, account, ethers.utils.getAddress(token.address));
    if (callerBalance.lt(bigNumberVolumeInWei)) {
      setError({
        title: 'Funds Too Low',
        message: 'You do not have sufficient funds for this stream.',
      });
      setApproveTransferState(ERROR);
      return;
    }
    try {
      await superfluidClient.approve(library, token.address, volume);

      setApproveTransferState(TRANSFERRING);
      await stream(recipient, flowRate, type);
    } catch (err) {
      logger.error(err, account);
      setApproveTransferState(ERROR);
      const { message, title } = openQClient.handleError(error);
      setError({ message, title });
    }
  }

  const approve = async (recipient, flowRate, type, token) => {
    const volume = (parseFloat(flowRate) * 30).toString();
    setApproveTransferState(APPROVING);
    try {
      await approveToken(volume, recipient, flowRate, type, token);
    } catch (err) {
      setApproveTransferState(ERROR);
      const { message, title } = openQClient.handleError(err);
      logger.error(err, account);
      setError({ message, title });
    }
  };

  const stream = async (recipient, flowRate, type, token) => {
    switch (type) {
      case 'create':
        await createNewFlowAndUpgrade(recipient, flowRate, token);
        break;
      case 'update':
        await updateFlow(recipient, flowRate, token);
        break;
      case 'delete':
        await deleteFlow(recipient, token);
        break;
    }
  };

  async function createNewFlowAndUpgrade(recipient, flowRate, token) {
    try {
      const tx = await superfluidClient.upgradeAndCreateFlowBacth(library, token.address, flowRate, account, recipient);
      await tx.wait();
      setTxnHash(tx.hash);

      setApproveTransferState(SUCCESS);
    } catch (error) {
      const { message, title } = openQClient.handleError(error, recipient);
      setError({ message, title });
      console.error(error);
      setApproveTransferState(ERROR);
    }
  }

  async function updateFlow(recipient, flowRate, token) {
    try {
      const tx = await superfluidClient.updateFlow(library, account, recipient, flowRate, token.address);
      await tx.wait();
      setTxnHash(tx.hash);
      setApproveTransferState(SUCCESS);
    } catch (err) {
      const { message, title } = openQClient.handleError(err, recipient);
      setError({ message, title });
      logger.error(err, account);
      console.error(error);

      setApproveTransferState(ERROR);
    }
  }

  async function deleteFlow(recipient, token) {
    setApproveTransferState(TRANSFERRING);
    try {
      const tx = await superfluidClient.deleteFlow(library, account, recipient, token.address);
      await tx.wait();
      setApproveTransferState(SUCCESS);
    } catch (error) {
      const { message, title } = openQClient.handleError(error, recipient);
      console.error(error);
      setError({ message, title });
      setApproveTransferState(ERROR);
    }
  }

  return (
    <div className='grid grid-cols-[repeat(auto-fit,_minmax(224px,_1fr))] max-w-[1200px] px-16 gap-3 w-full justify-center justify-items-center pt-8 h-min'>
      <div className='justify-self-stretch py-4 px-6 rounded-sm border-web-gray border'>
        <h2 className='font-semibold leading-normal text-sm text-primary pb-5'>Stream Monthly</h2>
        <p className='pb-5 text-xs text-muted leading-normal'>Stream tokens every month to any Polygon address.</p>
        <button onClick={() => setShowModal('create')} className='btn-card w-full'>
          Create Stream
        </button>
      </div>
      <div className='justify-self-stretch py-4 px-6 rounded-sm border-web-gray border h-min'>
        <h2 className='font-semibold leading-normal text-sm text-primary pb-5'>Update Stream</h2>
        <p className='pb-5 text-xs text-muted leading-normal'>Change the flow rate of an existing stream.</p>
        <button onClick={() => setShowModal('update')} className='btn-card w-full'>
          Update Stream
        </button>
      </div>
      <div className='justify-self-stretch py-4 px-6 rounded-sm border-web-gray border h-min'>
        <h2 className='font-semibold leading-normal text-sm text-primary pb-5'>Delete Stream</h2>
        <p className='pb-9 text-xs text-muted leading-normal'>Cancel an existing stream.</p>
        <button onClick={() => setShowModal('delete')} className='btn-card w-full mt-0.5'>
          Delete Stream
        </button>
      </div>

      <div className='justify-self-stretch py-4 px-6 rounded-sm border-web-gray border h-min'>
        <h2 className='font-semibold leading-normal text-sm text-primary pb-5'>Fund Stream</h2>
        <p className='pb-9 text-xs text-muted leading-normal'>Top up your stream with more tokens.</p>
        <button onClick={() => setShowModal('fund')} className='btn-card w-full mt-0.5'>
          Fund Stream
        </button>
      </div>

      <div className='w-2/4 flex flex-col gap-4 pt-16'>
        {showModal === 'fund' ? (
          <TokenProvider initialToken={initialToken}>
            <FundStreamModal
              resetState={() => {
                setShowModal(false);
                setApproveTransferState('CONFIRM');
              }}
              transactionHash={txnHash}
              showModal={showModal}
              setShowApproveTransferModal={setShowModal}
              fund={fund}
              approveTransferState={approveTransferState}
              error={error}
            />
          </TokenProvider>
        ) : (
          showModal && (
            <TokenProvider initialToken={initialToken}>
              <ApproveStreamModal
                resetState={() => {
                  setShowModal(false);
                  setApproveTransferState('CONFIRM');
                }}
                transactionHash={txnHash}
                deleteFlow={deleteFlow}
                showModal={showModal}
                setShowApproveTransferModal={setShowModal}
                approveTransferState={approveTransferState}
                confirmMethod={approve}
                error={error}
              />
            </TokenProvider>
          )
        )}
      </div>
    </div>
  );
};

export default CreateStream;
