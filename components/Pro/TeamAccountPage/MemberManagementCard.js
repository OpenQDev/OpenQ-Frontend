import React, { useEffect } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import { useContext, useState } from 'react';
import Image from 'next/image';
import TeamAccountContext from './TeamAccountContext';
import Link from 'next/link';

const MemberManagementCard = ({ member, groupKey, teamAccountId }) => {
  const [appState] = useContext(StoreContext);
  const [, proAccountDispatch] = useContext(TeamAccountContext);
  const [githubAccount, setGithubAccount] = useState(null);
  useEffect(() => {
    const fetchGithubAccount = async () => {
      const githubAccount = await appState.githubRepository.fetchUserById(member.github);
      setGithubAccount(githubAccount);
    };
    fetchGithubAccount();
  }, [member.github]);
  const removeMember = async () => {
    const { removeTeamAccountAdmin } = await appState.openQPrismaClient.removeTeamAccountAdmin(
      { targetUserId: member.id, teamAccountId },
      groupKey
    );
    proAccountDispatch({ type: 'ADD_ADMIN', payload: removeTeamAccountAdmin });
  };
  return (
    <div className='w-full px-4 py-2 gap-4 bg-nav-bg border-x border-b border-web-gray rounded-b-sm flex '>
      {githubAccount && (
        <>
          <Image className='rounded-full' width={48} height={48} src={githubAccount.avatarUrl} />
          <div className='flex flex-col justify-center flex-1'>
            <div className='leading-tight'> {member.username}</div>
            <div className='leading-tight'>
              <Link className='text-link-colour hover:underline' href={githubAccount.url}>
                {githubAccount.url}
              </Link>
            </div>
          </div>
          {groupKey !== 'ownerUsers' && (
            <button onClick={removeMember} className='btn-danger self-center py-1.5 leading-tight h-min'>
              Remove Member
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MemberManagementCard;
