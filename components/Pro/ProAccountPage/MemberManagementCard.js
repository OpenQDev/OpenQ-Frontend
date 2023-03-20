import React, { useEffect } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import { useContext, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MemberManagementCard = ({ member, groupKey, proAccountId }) => {
  const [appState] = useContext(StoreContext);
  const [githubAccount, setGithubAccount] = useState(null);
  useEffect(() => {
    const fetchGithubAccount = async () => {
      const githubAccount = await appState.githubRepository.fetchUserById(member.github);
      setGithubAccount(githubAccount);
    };
    fetchGithubAccount();
  }, [member.github]);
  console.log(githubAccount);
  const removeMember = async () => {
    await appState.openQPrismaClient.removeProAccountRole({ targetUserId: member.id, proAccountId }, groupKey);
  };
  return (
    <div className='w-full px-4 py-2 gap-4 bg-nav-bg border-x border-b border-web-gray rounded-b-sm flex '>
      {githubAccount && (
        <>
          <Image className='rounded-full' width={48} height={48} src={githubAccount.avatarUrl} />
          <div className='flex flex-col justify-center'>
            <div className='leading-tight'> {member.username}</div>
            <div className='leading-tight'>
              <Link className='text-link-colour hover:underline' href={githubAccount.url}>
                {githubAccount.url}
              </Link>
            </div>
          </div>
          {groupKey !== 'ownerUsers' && (
            <button onClick={removeMember} className='btn-danger'>
              Remove Member
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MemberManagementCard;
