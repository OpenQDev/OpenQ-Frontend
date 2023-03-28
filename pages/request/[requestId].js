import React from 'react';
import RequestIndividual from '../../components/Requests/RequestIndividual';
import WrappedOpenQPrismaClient from '../../services/openq-api/WrappedOpenQPrismaClient';
const Request = ({ request }) => {
  const item = {
    bounty: request.bounty,
    request: request,
  };
  return (
    <div className='max-w-[1280px] mx-auto px-40'>
      <RequestIndividual item={item} />
    </div>
  );
};
export default Request;

export const getServerSideProps = async (context) => {
  const { requestId } = context.params;
  const openQPrismaClient = new WrappedOpenQPrismaClient();
  const request = await openQPrismaClient.instance.getRequest(requestId);
  return {
    props: {
      request,
    },
  };
};
