import React from 'react';
import { CommentDiscussionIcon } from '@primer/octicons-react';

export default function IssueCard(props) {
  return (
    <a onClick={(e) => e.stopPropagation()} href={props.issue.url} target='_blank' rel='noreferrer' className='block'>
      <div className='w-full flex items-center px-3 py-1 bg-gray-800 hover:bg-violet-600 rounded-sm'>
        <span className='text-violet-300 mr-2'>#{props.issue.number}</span>
        {props.issue.title}
        <span className='ml-auto opacity-50'>
          <span className='mr-1 font-normal text-sm'>{props.issue.comments}</span>
          <CommentDiscussionIcon />
        </span>
      </div>
    </a>
  );
}
