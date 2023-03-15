import React, { useContext } from 'react';
import StoreContext from '../../../store/Store/StoreContext';

const CreateHackathonPage = ({ proAccount }) => {
  const [appState] = useContext(StoreContext);
  const makeMeHackathon = async () => {
    console.log('make hackathon');
    const proAccountId = proAccount.id;
    const repositoryId = 'MDEwOlJlcG9zaXRvcnkzODcxNjc5MjQ=';
    const organizationId = 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4';
    const startDate = new Date().toString();
    const registrationDeadline = new Date(Date.now() + 12096e5).toString();
    console.log(startDate, registrationDeadline);
    const variables = {
      proAccountId,
      repositoryId,
      startDate,
      registrationDeadline,
      isContest: true,
      organizationId,
    };
    const value = await appState.openQPrismaClient.updateRepositoryAsContest(variables);
    console.log(value);
  };
  return (
    <div>
      <h1>Create a Hackathon</h1>
      <button onClick={makeMeHackathon}>Make this a Hackathon</button>
    </div>
  );
};
export default CreateHackathonPage;
