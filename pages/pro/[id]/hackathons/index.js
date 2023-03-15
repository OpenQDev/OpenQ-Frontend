import React, { useState, useContext } from 'react';
import PageHeader from '../../../../components/PageHeader';
import Manager from '../../../../components/Manager/index.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import StoreContext from '../../../../store/Store/StoreContext';
import HackathonCard from '../../../../components/HackathonCard/index.js';

const hackathonManager = () => {
  const [searchText, setSearchText] = useState('');

  const menuState = useState('Manager');
  const { query } = useRouter();
  const internalMenu = menuState[0];
  const titleLine = {
    Title: () => <>Create Your Hackathon</>,
    SubTitle: () => (
      <>
        Learn more about our hackathon platform{' '}
        <Link className='hover:underline text-link-colour' href={'https://openq.dev'}>
          here
        </Link>
        .
      </>
    ),
  };
  const items = [{ name: 'Manager' }, { name: 'DRM' }];
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const CreateHackathon = ({ styles }) => {
    return (
      <>
        <Link
          href={`/pro/${query.id}/hackathons/create`}
          className={`lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap btn-primary flex flex-row space-x-3 items-center justify-center leading-tight h-min sm:w-min px-3 ${styles}`}
        >
          <div>Create Hackathon</div>
        </Link>
      </>
    );
  };

  return (
    <>
      <PageHeader
        CTAButton={CreateHackathon}
        menuState={menuState}
        titleLine={titleLine}
        items={items}
        searchText={searchText}
        handleSearchInput={handleSearchInput}
      >
        {internalMenu === 'Manager' && <Manager />}
        {internalMenu === 'DRM' && <Manager />}
      </PageHeader>
    </>
  );
};

export default hackathonManager;
