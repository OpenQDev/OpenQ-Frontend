import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import HackathonContext from '../HackathonStore/HackathonContext';
import { useRouter } from 'next/router';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';

const CreateHackathonButton = () => {
  const CONFIRM = 'CONFIRM';
  const PENDING = 'PENDING';
  const SUCCESS = 'SUCCESS';
  const ERROR = 'ERROR';
  const [hackathonState] = useContext(HackathonContext);
  const [createHackathonResponse, setCreateHackathonResponse] = useState(CONFIRM);
  const [appState] = useContext(StoreContext);
  const {
    repositoryUrl,
    startDate,
    endDate,
    city,
    eventOrganizer,
    isIrl,
    timezone,
    topic,
    website,
    contactEmail,
    twitter,
    discord,
    telegram,
    description,
    slack,
    registrationDeadline,
  } = hackathonState;
  const EmptyLoader = () => <></>;
  const responseMap = {
    CONFIRM: { text: 'Create Hackathon', Loader: EmptyLoader },
    PENDING: { text: 'Creating Hackathon', Loader: LoadingIcon },
    SUCCESS: { text: 'Success!', Loader: EmptyLoader },
    ERROR: { text: 'Failed to Update', Loader: EmptyLoader },
  };
  const Loader = responseMap[createHackathonResponse].Loader;
  const router = useRouter();
  const handleCreate = async (e) => {
    const proAccountId = router.query.id;
    e.preventDefault();

    const ownerRegex = /github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/;
    const owner = ownerRegex.exec(repositoryUrl)?.[1];

    const name = ownerRegex.exec(repositoryUrl)?.[2];
    try {
      setCreateHackathonResponse(PENDING);
      const githubRepository = await appState.githubRepository.fetchRepoWithLabeledIssues(owner, name, []);
      const repositoryId = githubRepository.id;
      const organizationId = githubRepository.owner.id;
      const variables = {
        proAccountId,
        repositoryId,
        startDate,
        endDate,
        organizationId,
        isContest: true,
        isDraft: false,
        city,
        isIrl,
        timezone,
        eventOrganizer,
        repositoryUrl,
        topic,
        website,
        contactEmail,
        twitter,
        discord,
        telegram,
        slack,
        registrationDeadline,
        description,
      };

      await appState.openQPrismaClient.updateRepositoryAsContest(variables);
      setCreateHackathonResponse(SUCCESS);
      //  router.push(`/pro/${proAccountId}/hackathons`);
    } catch (e) {
      setCreateHackathonResponse(ERROR);
    }
  };

  return (
    <div className='flex my-8 gap-4'>
      <button onClick={handleCreate} className='btn-primary flex'>
        {responseMap[createHackathonResponse].text}
        <Loader />
      </button>
      <button className='btn-default'>Preview</button>
    </div>
  );
};

export default CreateHackathonButton;
