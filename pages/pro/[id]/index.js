import React, { useState } from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient.js';
import ManageUserGroup from '../../../components/Pro/ProAccountPage/ManageUserGroup';
import SuperchargingHackathons from '../../../components/Pro/SuperchargingHackathons/index.js';

import ProProvider from '../../../components/Pro//ProAccountPage/ProProvider';
import PageHeader from '../../../components/PageHeader/index.js';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Manager from '../../../components/Manager/index.js';

const ProAccount = ({ proAccount }) => {
  const hasSuperchargedHackathons = proAccount?.permissionedProducts?.nodes?.some(
    (node) => node.name === 'SuperchargingHackathonsProduct'
  );
  const [searchText, setSearchText] = useState('');
  const HACKATHONS = 'Hackathons';
  const TEAM = 'Team';
  const menuState = useState(TEAM);
  const { query } = useRouter();
  const internalMenu = menuState[0];
  const titleLine = {
    [HACKATHONS]: {
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
      CTAButton: ({ styles }) => {
        return (
          <>
            <Link
              href={`/pro/${query.id}/createHackathon`}
              className={`lg:col-start-4 col-span-4 lg:col-span-1 whitespace-nowrap btn-primary flex flex-row space-x-3 items-center justify-center leading-tight h-min sm:w-min px-3 ${styles}`}
            >
              <div>Create Hackathon</div>
            </Link>
          </>
        );
      },
    },
    [TEAM]: {
      Title: () => <>Manage the {proAccount.name} Team</>,
      SubTitle: () => (
        <>
          Learn more about our hackathon platform{' '}
          <Link className='hover:underline text-link-colour' href={'https://openq.dev'}>
            here
          </Link>
          .
        </>
      ),
      CTAButton: () => {
        return <></>;
      },
    },
  };
  const hackathonMenuItem = hasSuperchargedHackathons ? [{ name: HACKATHONS }] : [{}];
  const items = [...hackathonMenuItem, { name: TEAM }];
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <PageHeader
        CTAButton={titleLine[internalMenu].CTAButton}
        menuState={menuState}
        titleLine={titleLine[internalMenu]}
        items={items}
        hasSearch={internalMenu === 'Hackathons'}
        searchText={searchText}
        handleSearchInput={handleSearchInput}
      >
        {internalMenu === 'Hackathons' && <Manager />}
        {internalMenu === 'Team' && (
          <ProProvider proAccount={proAccount}>
            <div className='w-full flex flex-col gap-y-4 relative flex-1  min-w-[260px]'>
              <ManageUserGroup groupName={'Owner(s)'} groupKey='ownerUsers' proAccount={proAccount} />

              <ManageUserGroup groupName={'Admins'} groupKey='adminUsers' proAccount={proAccount} />
              {proAccount.permissionedProducts.nodes.some((node) => node.name === 'SuperchargingHackathonsProduct') && (
                <SuperchargingHackathons proAccount={proAccount} />
              )}
            </div>
          </ProProvider>
        )}
      </PageHeader>
    </>
  );
};

export default ProAccount;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  await openQPrismaClient.instance.setGraphqlHeaders(context.req.headers.cookie);
  const { id } = context.query;
  const { proAccount } = await openQPrismaClient.instance.getProAccount(id);
  return {
    props: {
      proAccount,
    },
  };
};
