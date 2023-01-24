import React, { useState, useEffect, useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Image from 'next/image';
import Chain from '../../svg/chain';

const RequestIndividual = ({ bounty }) => {
  const [appState] = useContext(StoreContext);
  const requestingUser = bounty.request.requestingUser;
  const githubId = requestingUser.github;
  const issueId = bounty.bountyId;
  const [githubUser, setGithubUser] = useState({});
  const [issue, setIssue] = useState({});

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
            {requestingUser.username || githubUser.name || githubUser.login}
          </a>
        </div>
        <div>Request for acceptance of the w8 form.</div>
        <div>{issue.title}</div>
      </div>
      <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bounty.bountyId}/${bounty.address}`}>
        <Chain className='w-6 h-6 fill-primary' />
      </a>
      <div>
        <button className='btn-primary py-0.5 w-full self-center'>Accept</button>
      </div>
    </li>
  );
};
export default RequestIndividual;
