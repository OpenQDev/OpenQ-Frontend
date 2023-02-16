import React, { useContext, useState, useEffect } from 'react';

import Alert from '../../svg/alert';
import Cross from '../../svg/cross';
import StoreContext from '../../../store/Store/StoreContext';

const LoadingBar = () => {
  const [appState] = useContext(StoreContext);
  const { bountyMinted } = appState;
  const [loadingBar, setLoadingBar] = useState(false);
  const [changeText, setChangeText] = useState(false);
  useEffect(() => {
    if (bountyMinted) {
      setLoadingBar(true);
    }
    if (loadingBar && !bountyMinted) {
      setChangeText(true);
    }
  }, [bountyMinted]);
  return (
    <>
      {loadingBar && (
        <div className='flex fixed bottom-0 z-40 left-0 pl-8 p-4 bg-[#21262d] border border-gray-700 rounded-sm'>
          <div className='flex gap-2 items-center'>
            <Alert />
            <div>
              {!changeText
                ? 'It will take a couple of minutes until your contract will be visible in our explorer'
                : 'Please reload the page to see your new contract in our explorer'}
            </div>
          </div>
          <button className='pl-4 pr-0' onClick={() => loadingBar(false)}>
            <Cross />
          </button>
        </div>
      )}
    </>
  );
};

export default LoadingBar;
