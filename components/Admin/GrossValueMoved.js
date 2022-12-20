import React, { useState, useEffect, useContext } from 'react';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import Dropdown from '../Utils/Dropdown';
import StoreContext from '../../store/Store/StoreContext';

const GrossValueMoved = () => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const [coreMetrics, setCoreMetrics] = useState();
  const [previousClaimValues] = useGetTokenValues(coreMetrics?.previousClaims);
  const [currentClaimValues] = useGetTokenValues(coreMetrics?.currentClaims);
  const [previousDepositsValues] = useGetTokenValues(coreMetrics?.previousDeposits);
  const [currentDepositValues] = useGetTokenValues(coreMetrics?.currentDeposits);
  const [definedDepositValues] = useGetTokenValues(coreMetrics?.definedDeposits);
  const [definedPayoutValues] = useGetTokenValues(coreMetrics?.definedPayouts);
  const [monthVal, setMonthVal] = useState('October');
  const [yearVal, setYearVal] = useState('2022');
  const [monthTimes, setMonthTimes] = useState();
  const [totalLockedValues] = useGetTokenValues(coreMetrics?.totalBalances);
  const [totalClaimedValues] = useGetTokenValues(coreMetrics?.claimedBalances);

  useEffect(() => {
    const fetchData = async () => {
      const month = 2592000;
      const oneMonthAgo = parseInt(Date.now() / 1000) - month;
      const twoMonthsAgo = oneMonthAgo - month;
      const toTrueString = (num) => {
        return num.toLocaleString('fullwide', { useGrouping: false });
      };
      const times = {
        twoMonthsAgo: toTrueString(twoMonthsAgo),
        oneMonthAgo: toTrueString(oneMonthAgo),
        ...monthTimes,
      };
      if (monthTimes) {
        try {
          const coreMetrics = await appState.openQSubgraphClient.getCoreValueMetrics(times);
          setCoreMetrics(coreMetrics);
        } catch (err) {
          appState.logger.error(err, accountData.id, undefined, 'grossvaluemoved1');
        }
      }
    };
    fetchData();
  }, [yearVal, monthTimes]);
  useEffect(() => {
    const targetMonth = new Date(`${monthVal} 1,  ${yearVal}`);
    const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
    const firstSecond = (targetMonth.getTime() / 1000).toString();

    const lastSecond = (lastDayOfMonth.getTime() / 1000).toString();
    setMonthTimes({ firstSecond, lastSecond });
  }, [yearVal, monthVal]);
  const years = ['2022', '2023', '2024'];
  const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleString('en-US', { month: 'long' });
  });
  return (
    <>
      <div className='justify-center flex flex-col content-center items-center bg-black  rounded-lg w-40 h-44'>
        <div>TVL ${totalLockedValues?.total}</div>
        <div>TVC ${totalClaimedValues?.total || '0.0'}</div>
      </div>
      <table className='justify-center justify-items-center bg-black rounded-lg'>
        <thead>
          <tr>
            <td></td>
            <th className='px-4 py-4 '>Gross Value Funded</th>
            <th className='px-4 py-4 '>Gross Value Claimed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='px-4 py-4 '>Last 30 days</td>
            <td className='px-4 py-4 '>${currentDepositValues?.total || '0.00'}</td>
            <td className='px-4 py-4 '>${currentClaimValues?.total || '0.00'}</td>
          </tr>
          <tr>
            <td className='px-4 py-4 '>Previous 30 days</td>
            <td className='px-4 py-4 '>${previousDepositsValues?.total || '0.00'}</td>
            <td className='px-4 py-4 '>${previousClaimValues?.total || '0.00'}</td>
          </tr>

          <tr>
            <td className='px-4 py-4'>
              <Dropdown
                title={monthVal}
                toggleFunc={(e) => setMonthVal(e)}
                toggleVal={monthVal}
                names={months}
                width={'w-36'}
                dropdownWidth='w-36'
              />
              <Dropdown
                title={yearVal}
                toggleFunc={(e) => setYearVal(e)}
                toggleVal={yearVal}
                names={years}
                width={'w-36'}
                dropdownWidth='w-36'
              />
            </td>
            <td className='px-4 py-4 '>${definedDepositValues?.total || '0.00'}</td>
            <td className='px-4 py-4 '>${definedPayoutValues?.total || '0.00'}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default GrossValueMoved;
