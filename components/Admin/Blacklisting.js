import React, { useState, useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const Blacklisting = () => {
  const [appState] = useContext(StoreContext);

  const [orgId, setOrgId] = useState('');
  const [issueId, setIssueId] = useState('');
  const [banhammer, setBanhammer] = useState('');
  const [blacklistingIssue, setBlacklistingIssue] = useState(true);
  const [issueSuccess, setIssueSuccess] = useState();
  const [blacklistingOrg, setBlacklistingOrg] = useState(true);
  const [orgSuccess, setOrgSuccess] = useState();

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
          onChange={() => setBlacklistingIssue(false)}
          id='unblacklist org'
          type='radio'
        />
      </div>
      <div className='flex gap-2 text-sm justify-between w-24'>
        <label htmlFor='blacklist org'>blacklist</label>
        <input
          name='issue action'
          onChange={() => setBlacklistingIssue(true)}
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
          : `${blacklistingIssue ? 'B' : 'Unb'}lacklist Issue with ID: ${issueId || '<issueId>'}`}
      </button>
      <label className='block w-full my-2' htmlFor='organizationId'>
        Organization Id
      </label>
      <div className='flex gap-2 text-sm justify-between w-24'>
        <label htmlFor='unblacklist org'>unblacklist</label>
        <input
          name='org action'
          onChange={() => setBlacklistingOrg(false)}
          checked={!blacklistingOrg}
          id='unblacklist org'
          type='radio'
        />
      </div>
      <div className='flex gap-2 text-sm justify-between w-24'>
        <label htmlFor='blacklist org'>blacklist</label>
        <input
          name='org action'
          onChange={() => setBlacklistingOrg(true)}
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
          : `${blacklistingOrg ? 'B' : 'Unb'}lacklist organization with ID: ${orgId || '<organizationId>'}`}
      </button>
    </div>
  );
};

export default Blacklisting;
