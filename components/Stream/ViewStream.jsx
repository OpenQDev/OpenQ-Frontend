import React, { useContext, useEffect, useState } from 'react';
import useWeb3 from '../../hooks/useWeb3';
import StoreContext from '../../store/Store/StoreContext';
import Stream from './Stream';

const ViewStreams = () => {
  const { account } = useWeb3();
  const [superfluidData, setSuperfluidData] = useState();
  const [appState] = useContext(StoreContext);
  useEffect(() => {
    const getValue = async () => {
      if (account) {
        const value = await appState.superfluidClient.viewAccount(account);
        setSuperfluidData(value.data.account);
      }
    };
    getValue();
  }, [account]);

  return (
    <div className='mt-8'>
      <section>
        <h2 className='text-left font-semibold text-primary text-2xl'>
          {superfluidData?.inflows?.length > 0 ? 'Your' : 'No'} Inflows
        </h2>
        <div className='my-8'>
          {' '}
          {superfluidData &&
            superfluidData.inflows.map((elem, index) => <Stream key={index} direction={'in'} stream={elem} />)}
        </div>
      </section>

      <section>
        <h2 className='text-left font-semibold text-primary text-2xl'>
          {superfluidData?.outflows?.length > 0 ? 'Your' : 'No'} Outflows
        </h2>
        <div className='my-8 grid grid-cols-[1fr_1fr_1fr] w-full flex-wrap gap-8 justify-center'>
          {' '}
          {superfluidData &&
            superfluidData.outflows.map((elem, index) => <Stream key={index} direction={'out'} stream={elem} />)}
        </div>
      </section>
    </div>
  );
};

export default ViewStreams;
