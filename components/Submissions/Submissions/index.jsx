import React from 'react';
import SubmissionCard from '../SubmissionCard';

const Submissions = ({ bounty, refreshBounty }) => {
  const submissions = bounty?.submissions?.nodes;
  console.log(bounty, 'bounty');
  return (
    <>
      <div className='grid gap-8 w-full pt-8 justify-between justify-items-center grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]'>
        {submissions?.map((submission, index) => {
          return <SubmissionCard refreshBounty={refreshBounty} key={index} submission={submission} bounty={bounty} />;
        })}
      </div>
    </>
  );
};
export default Submissions;
