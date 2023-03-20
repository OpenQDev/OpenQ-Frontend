import React, { useEffect } from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient.js';
import ManageUserGroup from '../../../components/Pro/ManageUserGroup';
import SuperchargingHackathons from '../../../components/Pro/SuperchargingHackathons/index.js';
import PanelWithMetadata from '../../../components/Layout/PanelWithMetadata.js';

const ProAccount = ({ proAccount }) => {
  useEffect(() => {
    console.log('proAccount', proAccount);
  }, [proAccount]);

  return (
    <div>
      <PanelWithMetadata>
        <div className='w-full pt-4 flex flex-col gap-y-4 relative flex-1 pr-16 min-w-[260px]'>
          <h2 className='text-4xl'>{proAccount.name}</h2>
          <ManageUserGroup groupName={'Owner(s)'} groupKey='ownerUsers' proAccount={proAccount} />

          <ManageUserGroup groupName={'Admins'} groupKey='adminUsers' proAccount={proAccount} />
          <ManageUserGroup groupName={'Members'} groupKey='memberUsers' proAccount={proAccount} />
          {proAccount.permissionedProducts.nodes.some((node) => node.name === 'SuperchargingHackathonsProduct') && (
            <SuperchargingHackathons proAccount={proAccount} />
          )}
        </div>

        <ul className='lg:max-w-[300px] space-y-4  w-full lg:pl-4 p-8  lg:px-0 lg:pt-4'>
          <li>This that and the other</li>
        </ul>
      </PanelWithMetadata>
    </div>
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
