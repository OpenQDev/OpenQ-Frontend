import React from 'react';
import useWeb3 from '../../../hooks/useWeb3';

const GnosisWarning = () => {
  const { gnosisSafe } = useWeb3();
  if (gnosisSafe)
    return (
      <div className={'note pt-4'}>
        Hey! Looks like you are using gnosis safe via wallet connect. Because gnosis safes often require multiple
        signatures, this modal will will be stuck in a pending state. Once you're multi-sig has approved the
        transaction, please reload the app, and you'll see the results of your transaction.
      </div>
    );
  else return <></>;
};
export default GnosisWarning;
