import { ChevronLeftIcon } from '@primer/octicons-react';
import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import StyledInput from '../../Utils/StyledInput';

const CreateHackathonPage = ({ proAccount }) => {
  const [appState] = useContext(StoreContext);
  const [githubRepositoryUrl, setGithubRepositoryUrl] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const makeMeHackathon = async () => {
    const proAccountId = proAccount.id;
    const repositoryId = 'MDEwOlJlcG9zaXRvcnkzODcxNjc5MjQ=';
    const organizationId = 'MDEyOk9yZ2FuaXphdGlvbjc3NDAyNTM4';
    const startDate = new Date().toString();
    const registrationDeadline = new Date(Date.now() + 12096e5).toString();
    const variables = {
      proAccountId,
      repositoryId,
      startDate,
      registrationDeadline,
      isContest: true,
      organizationId,
    };
    await appState.openQPrismaClient.updateRepositoryAsContest(variables);
  };
  const handleUpdateGithubRepositoryUrl = async (urlInput) => {
    setGithubRepositoryUrl(urlInput);
    const ownerRegex = /github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/;
    const owner = ownerRegex.exec(urlInput)?.[1];

    const name = ownerRegex.exec(urlInput)?.[2];

    if (!owner && !name) {
      setName(name);
      setOrg(owner);
    }
  };
  return (
    <div>
      <button>
        <ChevronLeftIcon /> Save and finish later
      </button>
      <h2 className='font-semibold text-2xl'>Create a Hackathon</h2>
      <div className='note'>
        A hackathon contains all possible information about your event, manages your prices iun one of our escrow
        modules which are paid out automatically and allows to register and manage participants.
      </div>
      <form>
        <StyledInput
          controlled={true}
          value={githubRepositoryUrl}
          setValue={handleUpdateGithubRepositoryUrl}
          key={'githubRepositoryUrl'}
          displayLabel={'Github Repository URL'}
        />
        <StyledInput
          controlled={true}
          value={org}
          setValue={setOrg}
          displayLabel={'Event Organizer'}
          key={'eventOrganizer'}
        />
        <StyledInput
          controlled={true}
          value={name}
          setValue={setName}
          displayLabel={'Enter Name'}
          key={'eventOrganizer'}
        />
      </form>
      <button onClick={makeMeHackathon}>Make this a Hackathon</button>
    </div>
  );
};
export default CreateHackathonPage;
