import React, { useState, useEffect, useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';
import useWeb3 from '../../../hooks/useWeb3';
import Chain from '../../svg/chain';
import { ethers } from 'ethers';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import UnexpectedErrorModal from '../../Utils/UnexpectedErrorModal';
import { RESTING, CONFIRM, TRANSFERRING, SUCCESS, ERROR } from './RequestIndividualState';
import ModalLarge from '../../Utils/ModalLarge';

const RequestIndividual = ({ item }) => {
  const CALLER_NOT_ISSUER_OR_ORACLE = 'CALLER_NOT_ISSUER_OR_ORACLE';
  const { bounty, request } = item;
  const [appState] = useContext(StoreContext);
  const [subgraphBounty, setSubgraphBounty] = useState();
  const { accountData } = appState;

  const requestingUser = request?.requestingUser;
  const githubId = requestingUser.github;
  const issueId = bounty.bountyId;
  const [githubUser, setGithubUser] = useState({});
  const [issue, setIssue] = useState({});
  const { library } = useWeb3();
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [declineState, setDeclineState] = useState(RESTING);

  const resetState = () => {
    setDeclineState(RESTING);
    setMessage('');
  };

  const declineRequest = async () => {
    setDeclineState(CONFIRM);
    const requestId = request.id;
    const userId = accountData.id;
    await appState.openQPrismaClient.updateRequest({ requestId, message, userId });
  };

  const rejectRequest = async () => {
    setDeclineState(TRANSFERRING);
    const requestId = request.id;
    const userId = accountData.id;
    try {
      const { updateRequest } = await appState.openQPrismaClient.updateRequest({ requestId, message, userId });
      if (updateRequest) {
        setDeclineState(SUCCESS);
      }
    } catch (e) {
      setDeclineState(ERROR);
      setError({ title: 'Error', message: e?.message });
    }
  };

  const confirmBtn = {
    CONFIRM: (
      <button className='btn-danger' onClick={rejectRequest}>
        Decline
      </button>
    ),
    TRANSFERRING: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
    ERROR: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
    SUCCESS: (
      <button onClick={() => resetState()} className='btn-default'>
        Close
      </button>
    ),
  };

  const modalTitle = {
    CONFIRM: `Decline Request`,
    TRANSFERRING: 'Decline Request',
    SUCCESS: 'Message Sent',
    ERROR: error.title,
  };

  useEffect(() => {
    const getSubgraphBounty = async () => {
      try {
        const subgraphBounty = await appState.openQSubgraphClient.getBounty(bounty.address.toLowerCase());
        setSubgraphBounty(subgraphBounty);
        if (subgraphBounty.bountyType === '0' && subgraphBounty.supportingDocumentsCompleted?.[0]) {
          setAccepted(true);
        }
        if (!subgraphBounty.tierWinners) return;
        if (subgraphBounty.bountyType === '3') {
          const tier = parseInt(subgraphBounty?.tierWinners.indexOf(request.requestingUser.github));
          if (subgraphBounty.supportingDocumentsCompleted?.[tier]) {
            setAccepted(true);
          }
        }
      } catch (err) {
        appState.logger.error(err, 'RequestIndividual1', accountData.id);
      }
    };
    getSubgraphBounty();
  }, [bounty.address]);

  const updateMessage = async (e) => {
    setMessage(e.target.innerText);
  };

  const acceptRequest = async () => {
    let data = true;
    setLoading(true);
    try {
      if (item.bounty.type === '3') {
        const tier = parseInt(subgraphBounty.tierWinners.indexOf(request.requestingUser.github));

        const abiCoder = new ethers.utils.AbiCoder();
        const bigNumberTier = ethers.BigNumber.from(tier);
        data = abiCoder.encode(['uint256', 'bool'], [bigNumberTier, true]);
      }
      if (item.bounty.type === '0') {
        const abiCoder = new ethers.utils.AbiCoder();
        data = abiCoder.encode(['bool'], [true]);
      }
      await appState.openQClient.setSupportingDocumentsComplete(library, bounty.bountyId, data);
      setAccepted(true);
      setLoading(false);
    } catch (err) {
      if (err?.message?.includes(CALLER_NOT_ISSUER_OR_ORACLE)) {
        setError("You're not authorized to accept this request with this wallet, please change wallets.");
        setLoading(false);
        return;
      }
      appState.logger.error(err, 'RequestIndividual');
      setLoading(false);
    }
  };

  useEffect(() => {
    const getGithubUser = async () => {
      try {
        const githubUser = await appState.githubRepository.fetchUserById(githubId);
        setGithubUser(githubUser);
      } catch (err) {
        appState.logger.error(err, 'RequestIndividual2', accountData.id);
      }
    };
    getGithubUser();
  }, [githubId]);

  useEffect(() => {
    const getIssue = async () => {
      const issue = await appState.githubRepository.fetchIssueById(issueId);
      setIssue(issue);
    };
    getIssue();
  }, [issueId]);
  return (
    <li className='border gap-4 grid content-center items-center border-web-gray rounded-md p-4 my-4 grid-cols-[80px_1fr_160px]'>
      {githubUser.avatarUrl && (
        <Image
          alt='picture of request author'
          className='rounded-full'
          src={githubUser.avatarUrl}
          width='80'
          height='80'
        />
      )}
      <div className='leading-none self-start space-y-1.5 px-4'>
        <div>
          <a
            className='text-link-colour hover:underline'
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${requestingUser.id}`}
          >
            {requestingUser?.username || githubUser.name || githubUser.login}
          </a>
        </div>
        <div>Request for acceptance of the W8/W9 form.</div>
        <div className='flex gap-2'>
          {issue.title}{' '}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.address}`}
            target='_blank'
            rel='noreferrer'
          >
            <Chain className='w-6 h-6 fill-primary' />
          </a>
        </div>
      </div>
      <div>
        <button
          disabled={accepted || loading}
          onClick={acceptRequest}
          className={`flex w-fit gap-2 ${
            accepted || loading ? 'btn-default cursor-not-allowed' : 'btn-primary'
          } py-0.5 mb-2 w-full text-lg self-center flex content-center items-center justify-center`}
        >
          Accept{accepted ? 'ed' : loading ? 'ing' : ''}
          {loading && <LoadingIcon />}
        </button>
        {!accepted && (
          <button
            disabled={accepted || loading}
            onClick={declineRequest}
            className={`flex w-fit gap-2 ${
              accepted || loading ? 'btn-default cursor-not-allowed' : 'btn-danger'
            } py-0.5  w-full text-lg self-center flex content-center items-center justify-center`}
          >
            Decline{accepted ? 'd' : null}
          </button>
        )}
      </div>
      {declineState !== RESTING && (
        <ModalLarge
          setShowModal={resetState}
          resetState={resetState}
          title={modalTitle[declineState]}
          footerRight={confirmBtn[declineState]}
        >
          {declineState === TRANSFERRING && (
            <div className='p-4 flex'>
              Declining request...
              <LoadingIcon />
            </div>
          )}
          {declineState === CONFIRM && (
            <div className='flex flex-col h-full p-4 gap-4'>
              <div>Add a reason for rejecting the request so that the builder can make adjustments.</div>
              <div className='relative h-full group'>
                <div
                  className={`input-field rounded-sm group-focus-within:text-transparent ${
                    !message || message === '<br>' ? null : 'text-[#00000000]'
                  } pointer-events-none border-transparent absolute w-full h-full p-4`}
                >
                  Please add/adjust...
                </div>
                <div
                  onInput={updateMessage}
                  role='textbox'
                  className={`text-sm absolute w-full h-full rounded-sm p-4`}
                  contentEditable={true}
                ></div>
              </div>{' '}
            </div>
          )}
          {declineState === SUCCESS && (
            <div className='flex flex-col h-full p-4 gap-4'>
              <div>Message sent! We'll pass your message on to the bounty winner.</div>
            </div>
          )}
        </ModalLarge>
      )}
      {error && (
        <UnexpectedErrorModal
          closeModal={() => setError('')}
          error={error || 'An error occured while accepting this submission.'}
        />
      )}
    </li>
  );
};
export default RequestIndividual;
