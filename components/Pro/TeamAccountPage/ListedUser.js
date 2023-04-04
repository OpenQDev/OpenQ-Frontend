import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import DropDown from '../../Utils/Dropdown';

const ListedUser = ({ item }) => {
  const [appState] = useContext(StoreContext);
  const names = ['admin'];
  const router = useRouter();
  const { id } = router.query;

  const getRole = () => {
    if (item.adminOrganizations.nodes.some((node) => node.id === id)) {
      return 'admin';
    }
    if (item.ownerOrganizations.nodes.some((node) => node.id === id)) {
      return 'owner';
    }
    if (item.memberOrganizations.nodes.some((node) => node.id === id)) {
      return 'member';
    }
  };
  const role = getRole();

  const [toggleVal, setToggleVal] = useState(role || 'Select Role');
  const toggleFunc = async (toggle) => {
    if (toggle === 'admin') {
      await appState.openQPrismaClient.addTeamAccountRole({ teamAccountId: id, targetUserId: item.id }, toggle);
      setToggleVal(toggle);
    }
  };
  const removeFunc = async () => {
    await appState.openQPrismaClient.removeTeamAccountRole({ teamAccountId: id, targetUserId: item.id }, role);
    setToggleVal('Select Role');
  };
  const [githubAccount, setGithubAcount] = useState(null);
  useEffect(() => {
    const updateGithubUser = async () => {
      if (!item.github) return;
      const githubUser = await appState.githubRepository.fetchUserById(item.github);
      setGithubAcount(githubUser);
    };
    updateGithubUser();
  }, [item.github]);
  return (
    <>
      {githubAccount && (
        <div className='w-full px-4 py-2 gap-4 bg-nav-bg border-b border-web-gray flex justify-between '>
          <>
            <div className='flex gap-6'>
              <Image className='rounded-full' width={48} height={48} src={githubAccount.avatarUrl} />
              <div className='flex flex-col justify-center '>
                <div className='leading-tight'> {item.username}</div>
                <div className='leading-tight'>
                  <Link className='text-link-colour hover:underline' href={githubAccount.url}>
                    {githubAccount.url}
                  </Link>
                </div>
              </div>
            </div>
            {role === 'owner' ? (
              <div className='btn-default-disabled px-0 py-0 h-min w-40 cursor-not-allowed pl-4'>Owner</div>
            ) : (
              <button className='btn-default px-0 py-0 h-min w-40'>
                <DropDown
                  styles={'w-full flex'}
                  toggleFunc={toggleFunc}
                  dropdownWidth={' w-28'}
                  toggleVal={toggleVal}
                  names={names}
                  role={role}
                  removeFunc={removeFunc}
                />
              </button>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default ListedUser;
