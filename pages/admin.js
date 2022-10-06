import { useContext, useEffect, useState } from 'react';
import React from 'react';
import StoreContext from '../store/Store/StoreContext';
import useGetTokenValues from '../hooks/useGetTokenValues';
import useAuth from '../hooks/useAuth';

const Admin = () => {
  const [appState] = useContext(StoreContext);
  const [coreMetrics, setCoreMetrics] = useState();
  const [previousClaimValues] = useGetTokenValues(coreMetrics?.previousClaims);
  const [currentClaimValues] = useGetTokenValues(coreMetrics?.currentClaims);
  const [previousDepositsValues] = useGetTokenValues(coreMetrics?.previousDeposits);
  const [currentDepositValues] = useGetTokenValues(coreMetrics?.currentDeposits);
  const [totalLockedValues] = useGetTokenValues(coreMetrics?.totalBalances);
  const [showPage, setShowPage] = useState();
  const [orgId, setOrgId] = useState('');
  const [issueId, setIssueId] = useState('');
  const [banhammer, setBanhammer] = useState('');
  const [blacklistingIssue, setBlacklistingIssue] = useState(true);
  const [issueSuccess, setIssueSuccess] = useState();
  const [blacklistingOrg, setBlacklistingOrg] = useState(true);
  const [orgSuccess, setOrgSuccess] = useState();
  const [authState] = useAuth();
  useEffect(async () => {
    const currentTime = parseInt(Date.now() / 1000);
    const month = 2629800;
    const previousTime = currentTime - month;
    const toTrueString = (num) => {
      return num.toLocaleString('fullwide', { useGrouping: false });
    };
    const times = { previousTimestamp: toTrueString(previousTime), currentTimestamp: toTrueString(currentTime) };

    try {
      const coreMetrics = await appState.openQSubgraphClient.getCoreValueMetrics(times);
      setCoreMetrics(coreMetrics);
    } catch (err) {
      appState.logger.error(err);
    }
  }, []);

  useEffect(() => {
    console.log(authState);
    if (authState.isAdmin) {
      setShowPage(true);
    }
  }, [authState.isAdmin]);
  const handleOrgBlacklist = async () => {
    try {
      const data = await appState.openQPrismaClient.blacklistOrg(orgId, blacklistingOrg, banhammer);
      if (data) {
        setOrgSuccess(true);
        setTimeout(() => setOrgSuccess(), 1000);
      }
    } catch (err) {
      appState.logger.error(err);
    }
  };
  const handleIssueBlacklist = async () => {
    try {
      const data = await appState.openQPrismaClient.blacklistIssue(issueId, blacklistingIssue, banhammer);
      if (data) {
        setIssueSuccess(true);
        setTimeout(() => setIssueSuccess(), 1000);
      }
    } catch (err) {
      appState.logger.error(err);
    }
  };
  return (
    <div className='flex justify-center mt-1'>
      {showPage && (
        <div className='grid gap-8 justify-center content-center items-center grid-cols-[1fr_3fr] w-fit max-w-screen-lg min-h-[calc(100vh_-_246px)] text-xl font-semibold  text-muted'>
          <div className='justify-center flex content-center items-center bg-black  rounded-lg w-40 h-44'>
            <span> TVL ${totalLockedValues?.total}</span>
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
                <td className='px-4 py-4 '>This Month</td>
                <td className='px-4 py-4 '>${currentDepositValues?.total || '0.00'}</td>
                <td className='px-4 py-4 '>${currentClaimValues?.total || '0.00'}</td>
              </tr>
              <tr>
                <td className='px-4 py-4 '>Previous Month</td>
                <td className='px-4 py-4 '>${previousDepositsValues?.total || '0.00'}</td>
                <td className='px-4 py-4 '>${previousClaimValues?.total || '0.00'}</td>
              </tr>
            </tbody>
          </table>
          <div className='justify-center p-6 col-start-1 text-xl col-end-3  bg-black rounded-lg w-full'>
            <h2 className='my-4'>Blacklisting</h2>
            <label className='block w-full my-2' htmlFor='BANHAMMER' value={banhammer}>
              BANHAMMER secret
            </label>
            <input
              onChange={(e) => setBanhammer(e.target.value)}
              className='block bg-transparent border-web-gray border px-4 focus:outline focus:outline-blue-500 rounded-lg'
              id='BANHAMMER'
            />
            <label className='block w-full my-2' htmlFor='bountyId'>
              Github Issue Id
            </label>

            <div className='flex gap-2 text-sm justify-between w-24'>
              <label htmlFor='unblacklist org'>unblacklist</label>
              <input
                name='issue action'
                checked={!blacklistingIssue}
                onClick={() => setBlacklistingIssue(false)}
                id='unblacklist org'
                type='radio'
              />
            </div>
            <div className='flex gap-2 text-sm justify-between w-24'>
              <label htmlFor='blacklist org'>blacklist</label>
              <input
                name='issue action'
                onClick={() => setBlacklistingIssue(true)}
                checked={blacklistingIssue}
                id='blacklist org'
                type='radio'
              />
            </div>
            <input
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)}
              className='block bg-transparent border-web-gray border px-4 focus:outline focus:outline-blue-500 rounded-lg'
              id='bountyId'
            />
            <button onClick={handleIssueBlacklist} className='btn-danger text-lg my-4 w-96 h-16'>
              {issueSuccess
                ? 'Success'
                : `${blacklistingIssue ? 'B' : 'Unb'}lacklist Issue with ID: {issueId || '<issueId>'}`}
            </button>
            <label className='block w-full my-2' htmlFor='organizationId'>
              Organization Id
            </label>
            <div className='flex gap-2 text-sm justify-between w-24'>
              <label htmlFor='unblacklist org'>unblacklist</label>
              <input
                name='org action'
                onClick={() => setBlacklistingOrg(false)}
                checked={!blacklistingOrg}
                id='unblacklist org'
                type='radio'
              />
            </div>
            <div className='flex gap-2 text-sm justify-between w-24'>
              <label htmlFor='blacklist org'>blacklist</label>
              <input
                name='org action'
                onClick={() => setBlacklistingOrg(true)}
                checked={blacklistingOrg}
                id='blacklist org'
                type='radio'
              />
            </div>
            <input
              className='block bg-transparent border-web-gray border px-4 focus:outline focus:outline-blue-500 rounded-lg'
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              id='organizationId'
            />
            <button onClick={handleOrgBlacklist} className='btn-danger h-16 text-lg my-4 w-96'>
              {orgSuccess
                ? 'Success'
                : `${blacklistingOrg ? 'B' : 'Unb'}lacklisting organization with ID: ${orgId || '<organizationId>'}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
