import React, { useState } from 'react';
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
        <span className='mr-auto'>
          {props.repo.owner}/{props.repo.name}
        </span>
        <span className='text-sm'>{props.repo.issuesCount} issues</span>
      </h2>
      <p className='mt-2 mb-1'>{props.repo.description}</p>
      <p className='flex space-x-3 text-gray-600'>
        <span>Lang: {props.repo.language}</span>
        <span>Stars: {props.repo.stars}</span>
        <span className='grow text-right'>Last active: {props.repo.lastSynced}</span>
      </p>
      <div className={isOpen ? 'mt-4 space-y-3' : 'hidden'}>
        {issues?.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
