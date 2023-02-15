import React from 'react';
import { CommentDiscussionIcon } from '@primer/octicons-react';

export default function IssueCard(props) {
  return (
    <a onClick={(e) => e.stopPropagation()} href={props.issue.url} target='_blank' rel='noreferrer' className='block'>
      <button className='w-full flex items-center'>
        <span className='text-violet-300 mr-2'>#{props.issue.number}</span>
        {props.issue.title}
        <span className='ml-auto opacity-50'>
          <span className='mr-1 font-normal text-sm'>{props.issue.comments}</span>
          <CommentDiscussionIcon />
        </span>
      </button>
    </a>
  );
}
