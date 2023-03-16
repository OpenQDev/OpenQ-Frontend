import React, { useContext } from 'react';
import { ChevronLeftIcon } from '@primer/octicons-react';
import { useRouter } from 'next/router';
import HackathonContext from '../HackathonStore/HackathonContext';
import StoreContext from '../../../store/Store/StoreContext';
const CreateAsDraftButton = () => {
  const [hackathonState] = useContext(HackathonContext);
  const [appState] = useContext(StoreContext);
  const {
    repositoryUrl,
    description,
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
    slack,
    registrationDeadline,
  } = hackathonState;
  const router = useRouter();
  const handleCreateAsDraft = async (e) => {
    const proAccountId = router.query.id;
    e.preventDefault();

    const ownerRegex = /github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/;
    const owner = ownerRegex.exec(repositoryUrl)?.[1];

    const name = ownerRegex.exec(repositoryUrl)?.[2];
    const githubRepository = await appState.githubRepository.fetchRepoWithLabeledIssues(owner, name, []);
    const repositoryId = githubRepository.id;
    const organizationId = githubRepository.owner.id;
    const variables = {
      description,
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
    };

    await appState.openQPrismaClient.updateRepositoryAsContest(variables);
    router.push(`/pro/${proAccountId}/hackathons`);
  };
  return (
    <button
      onClick={handleCreateAsDraft}
      className=' flex content-center text-xs font-semibold items-center gap-2 py-2'
    >
      <ChevronLeftIcon />
      Save and finish later
    </button>
  );
};

export default CreateAsDraftButton;
