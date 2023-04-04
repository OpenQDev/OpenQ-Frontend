import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import AuthButton from '../../components/Authentication/AuthButton';
import ProPage from '../../components/Pro/ProPage';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
import TeamAccountProvider from '../../components/Pro/ProPage/ProPageProvider';

const TeamAccount = ({ myTeamAccountInfo }) => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const { id } = accountData;
  return (
    <>
      {id ? (
        <TeamAccountProvider myTeamAccountInfo={myTeamAccountInfo}>
          <ProPage />
        </TeamAccountProvider>
      ) : (
        <>
          <h1 className='text-4xl my-8 col-span-3'>Please sign in to create a Pro Account</h1>

          <AuthButton />
        </>
      )}
    </>
  );
};
export default TeamAccount;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  await openQPrismaClient.instance.setGraphqlHeaders(context.req.headers.cookie);
  const myTeamAccountInfo = await openQPrismaClient.instance.getTeamAccountInfoOfCurrent();
  return {
    props: { myTeamAccountInfo },
  };
};
