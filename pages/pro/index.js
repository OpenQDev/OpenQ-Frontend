import React, { useContext, useEffect } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import AuthButton from '../../components/Authentication/AuthButton';
import ProPage from '../../components/Pro/ProPage/index.js';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';

const ProAccount = ({ myProAccountInfo }) => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  useEffect(() => {
    console.log('myProAccountInfo', myProAccountInfo);
  }, [myProAccountInfo]);
  const { id } = accountData;
  return (
    <>
      {id ? (
        <ProPage myProAccountInfo={myProAccountInfo} />
      ) : (
        <>
          <h1 className='text-4xl my-8 col-span-3'>Please sign in to create a Pro Account</h1>

          <AuthButton />
        </>
      )}
    </>
  );
};
export default ProAccount;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  await openQPrismaClient.instance.setGraphqlHeaders(context.req.headers.cookie);
  const myProAccountInfo = await openQPrismaClient.instance.getProAccountInfoOfCurrent();
  return {
    props: { myProAccountInfo },
  };
};
