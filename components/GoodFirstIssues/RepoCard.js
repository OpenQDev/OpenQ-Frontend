import React, { useState } from 'react';
import { StarIcon } from '@primer/octicons-react';
import IssueCard from './IssueCard';

export default function RepoCard(props) {
  const [isOpen, setIsOpen] = useState(false);

  const issues = JSON.parse(props.repo.issuesJson);

  return (
    <div
      className={[
        'p-4 border border-gray-800 hover:bg-[#191e25] rounded cursor-pointer',
        isOpen ? 'bg-[#191e25]' : 'bg-[#161b22]',
      ].join(' ')}
      onClick={() => setIsOpen(!isOpen)}
    >
      <h2 className='flex items-center'>
        <span className='mr-auto font-bold text-lg'>
          {props.repo.owner}/{props.repo.name}
        </span>
        <span className='flex items-center mx-3'>
          <StarIcon className='mr-1' />
          {props.repo.stars}
        </span>
        <span className='font-bold bg-violet-600 text-white px-3 py-1 rounded-sm'>{props.repo.issuesCount} issues</span>
      </h2>
      <div className='text-sm text-gray-400'>{props.repo.language}</div>
      <p className='mt-3 mb-1 text-gray-400'>{props.repo.description}</p>
      <div className={isOpen ? 'mt-4 space-y-3' : 'hidden'}>
        {issues?.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
