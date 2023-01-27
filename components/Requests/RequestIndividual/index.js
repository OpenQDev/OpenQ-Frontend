import React, { useState, useEffect, useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';
import useWeb3 from '../../../hooks/useWeb3';
import Chain from '../../svg/chain';
import { ethers } from 'ethers';

const RequestIndividual = ({ bounty, request }) => {
  const [appState] = useContext(StoreContext);
  const [subgraphBounty, setSubgraphBounty] = useState();

  const requestingUser = request?.requestingUser;
  const githubId = requestingUser.github;
  const issueId = bounty.bountyId;
  const [githubUser, setGithubUser] = useState({});
  const [issue, setIssue] = useState({});
  const { library } = useWeb3();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const getSubgraphBounty = async () => {
      const subgraphBounty = await appState.openQSubgraphClient.getBounty(bounty.address.toLowerCase());
      setSubgraphBounty(subgraphBounty);
      const tier = parseInt(subgraphBounty.tierWinners.indexOf(request.requestingUser.github));
      if (subgraphBounty.supportingDocumentsCompleted?.[tier]) {
        setAccepted(true);
      }
    };
    getSubgraphBounty();
  }, [bounty.address]);

  const acceptRequest = async () => {
    let data = true;

    if (subgraphBounty.bountyType === '2' || subgraphBounty.bountyType === '3') {
      const tier = parseInt(subgraphBounty.tierWinners.indexOf(request.requestingUser.github));

      const abiCoder = new ethers.utils.AbiCoder();
      const bigNumberTier = ethers.BigNumber.from(tier + 1);
      data = abiCoder.encode(['uint256', 'bool'], [bigNumberTier, true]);
    }

    await appState.openQClient.setSupportingDocumentsRequired(library, bounty.bountyId, data);
    setAccepted(true);
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
    <li className='border gap-4 grid content-center items-center border-web-gray rounded-md p-4 grid-cols-[80px_1fr_24px_120px]'>
      <Image className='rounded-full' src={githubUser.avatarUrl} width='80' height='80' />
      <div className='leading-none self-start space-y-1.5 px-4'>
        <div>
          <a
            className='text-link-colour hover:underline'
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/${requestingUser.id}`}
          >
            {requestingUser?.username || githubUser.name || githubUser.login}
          </a>
        </div>
        <div>Request for acceptance of the w8 form.</div>
        <div>{issue.title}</div>
      </div>
      <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.address}`}>
        <Chain className='w-6 h-6 fill-primary' />
      </a>
      <div>
        <button
          onClick={acceptRequest}
          className={`${accepted ? 'btn-default' : 'btn-primary'} py-0.5 w-full self-center`}
        >
          Accept
        </button>
      </div>
    </li>
  );
};
export default RequestIndividual;
