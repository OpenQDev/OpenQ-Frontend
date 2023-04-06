import React, { useContext } from 'react';
import StoreContext from '../../../../../store/Store/StoreContext';
import MintContext from '../../../MintContext';

export default function IssueDetailsBubble() {
  const [appState] = useContext(StoreContext);
  const [mintState] = useContext(MintContext);
  const { issue } = mintState;

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='flex flex-row space-x-2'>
          <div className='flex items-center'>
            <div className=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill={issue?.closed ? '#F0431D' : '#15FB31'}
                viewBox='0 0 16 16'
                width='17'
                height='17'
              >
                <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
                <path
                  fillRule='evenodd'
                  d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
                ></path>
              </svg>
            </div>
          </div>
          <div className='break-word text-sm'> {issue.title}</div>
        </div>
        <div className='text-xs pt-1 text-muted'>
          {' '}
          Created on {appState.utils.formatDate(issue.createdAt)} {issue.author && `by ${issue.author.login}`}
        </div>
      </div>
    </>
  );
}
