import React, { useState, useEffect, useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';
import useWeb3 from '../../../hooks/useWeb3';
import Chain from '../../svg/chain';
import { ethers } from 'ethers';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import UnexpectedErrorModal from '../../Utils/UnexpectedErrorModal';

const RequestIndividual = ({ item }) => {
  const CALLER_NOT_ISSUER_OR_ORACLE = 'CALLER_NOT_ISSUER_OR_ORACLE';
  const { bounty, request } = item;
  const [appState] = useContext(StoreContext);
  const [subgraphBounty, setSubgraphBounty] = useState();

  const requestingUser = request?.requestingUser;
  const githubId = requestingUser.github;
  const issueId = bounty.bountyId;
  const [githubUser, setGithubUser] = useState({});
  const [issue, setIssue] = useState({});
  const { library } = useWeb3();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getSubgraphBounty = async () => {
      const subgraphBounty = await appState.openQSubgraphClient.getBounty(bounty.address.toLowerCase());
      setSubgraphBounty(subgraphBounty);
      if (!subgraphBounty.tierWinners) return;
      const tier = parseInt(subgraphBounty?.tierWinners.indexOf(request.requestingUser.github));
      if (subgraphBounty.supportingDocumentsCompleted?.[tier]) {
        setAccepted(true);
      }
    };
    getSubgraphBounty();
  }, [bounty.address]);

  const acceptRequest = async () => {
    let data = true;
    setLoading(true);

    try {
      if (subgraphBounty.bountyType === '2' || subgraphBounty.bountyType === '3') {
        const tier = parseInt(subgraphBounty.tierWinners.indexOf(request.requestingUser.github));

        const abiCoder = new ethers.utils.AbiCoder();
        const bigNumberTier = ethers.BigNumber.from(tier);
        data = abiCoder.encode(['uint256', 'bool'], [bigNumberTier, true]);
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
      const githubUser = await appState.githubRepository.fetchUserById(githubId);
      setGithubUser(githubUser);
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
      <Image
        alt='picture of request author'
        className='rounded-full'
        src={githubUser.avatarUrl}
        width='80'
        height='80'
      />
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
          <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.address}`}>
            <Chain className='w-6 h-6 fill-primary' />
          </a>
        </div>
      </div>

      <button
        disabled={accepted || loading}
        onClick={acceptRequest}
        className={`flex w-fit gap-2 ${
          accepted || loading ? 'btn-default cursor-not-allowed' : 'btn-primary'
        } py-0.5 w-full text-lg self-center flex content-center items-center justify-center`}
      >
        Accept{accepted ? 'ed' : loading ? 'ing' : ''}
        {loading && <LoadingIcon />}
      </button>
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
