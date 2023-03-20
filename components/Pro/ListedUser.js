import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import DropDown from '../Utils/Dropdown';

const ListedUser = ({ item }) => {
  const [appState] = useContext(StoreContext);
  const names = ['admin', 'owner', 'member'];
  const toggleFunc = () => {
    console.log('toggle');
  };
  const router = useRouter();
  const { id } = router.query;
  console.log(item.ownerOrganizations.nodes);
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
  const [githubAccount, setGithubAcount] = useState(null);
  useEffect(() => {
    const updateGithubUser = async () => {
      const githubUser = await appState.githubRepository.fetchUserById(item.github);
      setGithubAcount(githubUser);
    };
    updateGithubUser();
  }, [item.github]);
  return (
    <div className='w-full px-4 py-2 gap-4 bg-nav-bg border-b border-web-gray flex '>
      {githubAccount && (
        <>
          <Image className='rounded-full' width={48} height={48} src={githubAccount.avatarUrl} />
          <div className='flex flex-col justify-center'>
            <div className='leading-tight'> {item.username}</div>
            <div className='leading-tight'>
              <Link className='text-link-colour hover:underline' href={githubAccount.url}>
                {githubAccount.url}
              </Link>
            </div>
          </div>
          <DropDown toggleFunc={toggleFunc} dropdownWidth={'w-40'} toggleVal={role} names={names} role={role} />
        </>
      )}
    </div>
  );
};

export default ListedUser;
