import React, { useState, useContext, useEffect } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import DropDown from '../../Utils/Dropdown';

const ListedUser = ({ item }) => {
  const [appState] = useContext(StoreContext);
  const names = ['admin'];

  const toggleFunc = (toggle) => {
    setToggleVal(toggle);
  };
  const router = useRouter();
  const { id } = router.query;
  console.log(item.ownerOrganizations.nodes);
  const getRole = () => {
    if (item.adminOrganizations.nodes.some((node) => node.id === id)) {
      return 'admin';
    }
    if (item.ownerOrganizations.nodes.some((node) => node.id === id)) {
      return 'admin';
    }
    if (item.memberOrganizations.nodes.some((node) => node.id === id)) {
      return 'member';
    }
  };
  const role = getRole();

  const [toggleVal, setToggleVal] = useState('Select Role');
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
          {role === 'owner' ? (
            <div>Owner</div>
          ) : (
            <button className='btn-default px-0 py-0 h-min w-40'>
              <DropDown
                styles={'w-full flex justify-end'}
                toggleFunc={toggleFunc}
                dropdownWidth={' w-60'}
                toggleVal={toggleVal}
                names={names}
                role={role}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ListedUser;
