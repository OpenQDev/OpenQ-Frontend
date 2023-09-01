// Third party
import React from 'react';
import ShowCasePage from '../../../../components/ShowCase/SubmissionPage';
import WrappedOpenQPrismaClient from '../../../../services/openq-api/WrappedOpenQPrismaClient';
const DedicatedSubmissionPage = ({ submission }) => {
  return <>{submission && <ShowCasePage submission={submission} />}</>;
};

export default DedicatedSubmissionPage;

export const getServerSideProps = async (context) => {
  const openQPrismaClient = new WrappedOpenQPrismaClient();

  const { submissionId } = context.query;
  const submission = await openQPrismaClient.instance.getSubmissionById(submissionId);

  return {
    props: {
      submission,
    },
  };
};
