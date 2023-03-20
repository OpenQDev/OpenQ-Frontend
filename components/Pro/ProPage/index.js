import React, { useContext, useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import Link from 'next/link';
import CreateAccountModal from './CreateAccountModal';
import { CalendarIcon, PeopleIcon } from '@primer/octicons-react';
import ProAccountContext from './ProPageContext';
import { getPlural } from '../../../services/utils/lib';

const ProPage = () => {
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const menuState = useState('Dashboard');
  const [proAccountState] = useContext(ProAccountContext);
  const { adminOrganizations, ownerOrganizations } = proAccountState;
  const proOrgsWithPerms = [
    ...adminOrganizations.map((value) => ({ ...value, role: 'ADMIN' })),
    ...ownerOrganizations.map((value) => ({ ...value, role: 'OWNER' })),
  ];
  const titleLine = {
    Title: () => <>Manage Pro Accounts</>,
    SubTitle: () => (
      <>
        Learn more about our pro accounts{' '}
        <Link className='hover:underline text-link-colour' href={'https://openq.dev'}>
          here
        </Link>
        .
      </>
    ),
  };
  const items = [{ name: 'Dashboard' }];
  const handleSearchInput = (e) => {
    console.log(e.target.value, 'TARGET');
    setSearchText(e.target.value);
  };

  const CreateHackathon = ({ styles }) => {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap btn-primary flex flex-row space-x-3 items-center justify-center leading-tight h-min sm:w-min px-3 ${styles}`}
        >
          <div>Create Pro Account</div>
        </button>
      </>
    );
  };
  return (
    <PageHeader
      CTAButton={CreateHackathon}
      menuState={menuState}
      titleLine={titleLine}
      items={items}
      searchText={searchText}
      handleSearchInput={handleSearchInput}
    >
      {<CreateAccountModal showModal={showModal} setShowModal={setShowModal} />}
      <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-4 w-full justify-between justify-items-stretch'>
        {proOrgsWithPerms?.map((proAccount) => {
          const numberOfManagers = proAccount.adminUsers?.nodes?.length || 1;
          return (
            <div className=' w-60' key={proAccount.id}>
              <div className='p-4 bg-nav-bg rounded-t-sm border-x border-t border-web-gray'>
                <Link
                  className='text-link-colour font-semibold'
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/pro/${proAccount.id}`}
                >
                  {proAccount.name}
                </Link>
              </div>
              <div className='border-x border-b border-web-gray p-4 rounded-b-sm '>
                <p className='flex items-center content-center text-sm font-semibold text-muted gap-2'>
                  <CalendarIcon />
                  Created on 12.08.2022
                </p>
                <p className='flex items-center content-center text-sm font-semibold text-muted gap-2'>
                  <PeopleIcon />
                  {numberOfManagers} Manager{getPlural(numberOfManagers)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </PageHeader>
  );
};
export default ProPage;
