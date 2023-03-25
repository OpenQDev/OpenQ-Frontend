// Third Party
import React, { useState } from 'react';
import Cross from '../../components/svg/cross';

const FirstTimeBanner = () => {
  const [isFirstLaunch] = useState(true);
  const [showBanner, updateShowBanner] = useState(true);

  return (
    <>
      {showBanner && isFirstLaunch ? (
        <div className='w-full bg-[#21262d] border-gray-700 border-b grid grid-cols-[1fr_1fr_1fr_1fr] py-4 items-center px-4'>
          <div className='col-start-2 col-end-4 text-center text-sm min-w-[240px]'>
            Welcome to <span className='font-bold'>OpenQ!</span>
            <br />
            <br />
            <div>Most EthDenver bounties have been minted and are in the process of being funded by sponsors.</div>
            <br />
            <div>EthDenver and team are reviewing all pull request submissions and will verify winners ASAP.</div>
            <br />
            <div>Keep an eye on your inbox for updates.</div>
            <br />
            <div>
              The Graph is experiencing intermittent outtages which are effecting OpenQ. Stand by as the Graph fixes the
              issue.
            </div>
          </div>
          <div className='flex justify-self-end'>
            <button onClick={() => updateShowBanner(false)} className='px-4'>
              <Cross />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FirstTimeBanner;
