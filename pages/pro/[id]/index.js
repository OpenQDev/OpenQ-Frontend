import React from 'react';
import WrappedOpenQPrismaClient from '../../../services/openq-api/WrappedOpenQPrismaClient.js';
import ManageUserGroup from '../../../components/Pro/ManageUserGroup';
import SuperchargingHackathons from '../../../components/Pro/SuperchargingHackathons/index.js';

const ProAccount = ({ proAccount }) => {
  console.log(proAccount);
  return (
    <div>
      <ManageUserGroup groupName={'Owner(s)'} groupKey='ownerUsers' proAccount={proAccount} />

      <ManageUserGroup groupName={'Admins'} groupKey='adminUsers' proAccount={proAccount} />
      <ManageUserGroup groupName={'Members'} groupKey='memberUsers' proAccount={proAccount} />
      {proAccount.permissionedProducts.nodes.some((node) => node.name === 'SuperchargingHackathonsProduct') && (
        <SuperchargingHackathons proAccount={proAccount} />
      )}
    </div>
  );
};
export default ProAccount;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const { id } = context.query;
  const { proAccount } = await openQPrismaClient.instance.getProAccount(id);
  return {
    props: {
      proAccount,
    },
  };
};
