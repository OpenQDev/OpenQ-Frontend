import React, { useContext } from 'react';
import HackathonContext from '../HackathonStore/HackathonContext';
import { handleDispatch } from '../../../services/utils/lib';

const HackathonTime = () => {
  const [hackathonState, hackathonDispatch] = useContext(HackathonContext);

  const { topic, website, contactEmail, twitter, discord, telegram, slack } = hackathonState;

  const handleTopics = (e) => {
    const dispatch = {
      type: 'SET_TOPIC',
      payload: e.target.value.split(','),
    };
    hackathonDispatch(dispatch);
  };

  return (
    <>
      <div className='border-t border-web-gray my-8'>
        <label className='font-semibold text-lg block my-2' htmlFor={'topics'}>
          Topics
        </label>
        <input
          value={topic.join(',')}
          onChange={handleTopics}
          className='input-field w-full max-w-60 h-8 '
          id={'topics'}
        />
      </div>
      <div className='border-t border-web-gray my-8 grid grid-cols-2 justify-between w-full'>
        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'website'}>
            Website
          </label>
          <input
            value={website}
            onChange={(e) => handleDispatch(e, 'SET_WEBSITE', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'website'}
          />
        </div>

        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'contactEmail'}>
            Contact Email
          </label>
          <input
            value={contactEmail}
            onChange={(e) => handleDispatch(e, 'SET_CONTACT_EMAIL', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'contactEmail'}
          />
        </div>

        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'twitter'}>
            Twitter
          </label>
          <input
            value={twitter}
            onChange={(e) => handleDispatch(e, 'SET_TWITTER', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'twitter'}
          />
        </div>
        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'discord'}>
            Discord
          </label>
          <input
            value={discord}
            onChange={(e) => handleDispatch(e, 'SET_DISCORD', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'discord'}
          />
        </div>
        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'telegram'}>
            Telegram
          </label>
          <input
            value={telegram}
            onChange={(e) => handleDispatch(e, 'SET_TELEGRAM', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'telegram'}
          />
        </div>

        <div>
          <label className='font-semibold text-lg block my-2' htmlFor={'slack'}>
            Slack
          </label>
          <input
            value={slack}
            onChange={(e) => handleDispatch(e, 'SET_SLACK', hackathonDispatch)}
            className='input-field w-full max-w-60 h-8 '
            id={'slack'}
          />
        </div>
      </div>
    </>
  );
};

export default HackathonTime;
