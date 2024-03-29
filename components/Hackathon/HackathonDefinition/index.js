import React, { useContext } from 'react';
import HackathonContext from '../HackathonStore/HackathonContext';
import { handleDispatch } from '../../../services/utils/lib';
const HackathonDefinition = ({ isEditing }) => {
  const [hackathonState, hackathonDispatch] = useContext(HackathonContext);
  const { eventOrganizer, eventName, repositoryUrl, description, prizePool } = hackathonState;
  const handleUpdateGithubRepositoryUrl = async (e) => {
    const urlInput = e.target.value;
    const ownerRegex = /github.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)/;
    const parsedOwner = ownerRegex.exec(urlInput)?.[1];

    const parsedName = ownerRegex.exec(urlInput)?.[2];

    if (!eventOrganizer && !name) {
      const ownerDispatch = {
        type: 'SET_EVENT_ORGANIZER',
        payload: parsedOwner,
      };
      const nameDispatch = {
        type: 'SET_NAME',
        payload: parsedName,
      };
      hackathonDispatch(ownerDispatch);
      hackathonDispatch(nameDispatch);
    }
    handleDispatch(e, 'SET_REPOSITORY_URL', hackathonDispatch);
  };

  return (
    <>
      <div className='my-2'>
        <label className='font-semibold text-lg block my-2' htmlFor={'repositoryUrl'}>
          Github Repository URL
        </label>

        {isEditing ? (
          <div className='input-field bg-transparent py-1.5 w-full h-8 '>{repositoryUrl}</div>
        ) : (
          <input
            required='true'
            onChange={handleUpdateGithubRepositoryUrl}
            className='input-field w-full h-8 '
            id={'repositoryUrl'}
            placeholder={'https://github.com/...'}
            value={repositoryUrl}
          />
        )}
        {isEditing ? (
          <div className='note mt-2 '>You can't change the repository of hackathon after creating it.</div>
        ) : (
          <div className='note mt-2 '>
            Connect your Hackathon with your Github repository to manage submissions. Your README.md will display basic
            information about the hackathon on our site.
          </div>
        )}
        <label className='font-semibold text-lg block my-2' htmlFor={'event-organizer'}>
          Event organizer
        </label>

        <input
          value={eventOrganizer}
          onChange={(e) => handleDispatch(e, 'SET_EVENT_ORGANIZER', hackathonDispatch)}
          className='input-field w-full h-8'
          id={'event-organizer'}
        />
      </div>

      <div className='my-2'>
        <label className='font-semibold text-lg block my-2' htmlFor={'name'}>
          Enter name
        </label>

        <input
          className='input-field w-full h-8'
          id={'name'}
          value={eventName}
          onChange={(e) => handleDispatch(e, 'SET_NAME', hackathonDispatch)}
        />
      </div>
      <div className='my-2 mb-4'>
        <label className='font-semibold text-lg block my-2' htmlFor={'name'}>
          Hackathon Description
        </label>

        <input
          className='input-field w-full h-8'
          id={'description'}
          value={description}
          onChange={(e) => handleDispatch(e, 'SET_DESCRIPTION', hackathonDispatch)}
        />
      </div>
      <div className='my-2 mb-4'>
        <label className='font-semibold text-lg block my-2' htmlFor={'name'}>
          Prize Pool
        </label>

        <input
          className='input-field w-full h-8'
          id={'prize pool'}
          value={prizePool}
          onChange={(e) => handleDispatch(e, 'SET_PRIZE_POOL', hackathonDispatch)}
        />
      </div>
    </>
  );
};

export default HackathonDefinition;
