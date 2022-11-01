import React from 'react';
import SubmissionCard from './SubmissionCard';

const Submissions = ({ bounty }) => {
  const prs = bounty.prs;
  return (
    <div className='grid gap-4 w-full grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]'>
      {prs.map((pr, index) => {
        return <SubmissionCard key={index} pr={pr} bounty={bounty} />;
      })}
      {prs.map((pr, index) => {
        return <SubmissionCard key={index} pr={pr} bounty={bounty} />;
      })}
      {prs.map((pr, index) => {
        return <SubmissionCard key={index} pr={pr} bounty={bounty} />;
      })}
      {prs.map((pr, index) => {
        return <SubmissionCard key={index} pr={pr} bounty={bounty} />;
      })}
    </div>
  );
};
export default Submissions;
