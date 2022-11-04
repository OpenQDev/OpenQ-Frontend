import React from 'react';
import SubmissionCard from './SubmissionCard';

const Submissions = ({ bounty, refreshBounty }) => {
  const prs = bounty.prs;
  return (
    <div className='grid gap-8 w-full pt-8 justify-between justify-items-center grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]'>
      {prs.map((pr, index) => {
        return <SubmissionCard refreshBounty={refreshBounty} key={index} pr={pr.source} bounty={bounty} />;
      })}
    </div>
  );
};
export default Submissions;
