// Third party
import React, { useRef } from 'react';
import Link from 'next/link';

const LinkDropdown = ({ items, styles }) => {
  // Hooks
  const ref = useRef();

  // Render
  return (
    <div
      ref={ref}
      open={true}
      className={`max-h-0 ${styles} px-1 hidden group-focus-within:block group-focus:block text-sm text-muted `}
    >
      <div className='w-full'>
        {items.length > 0 ? (
          <ul className='z-20 overflow-hidden relative bg-subtle w-full -mt-1 mb-4 shadow-[rgb(1,_4,_9)_0px_8px_24px_0px] border-web-gray border-x border-b rounded-b-sm'>
            {items.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className='cursor-pointer flex  w-full gap-4 hover:bg-link-colour text-white py-2 px-4 border-t border-web-gray'
                >
                  {item.isIssue ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                      className='fill-primary relative top-0.5'
                    >
                      <path d='M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'></path>
                      <path
                        fillRule='evenodd'
                        d='M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z'
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                      className='fill-primary relative top-0.5'
                    >
                      <path
                        fillRule='evenodd'
                        d='M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v1.25h2.25a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5a.25.25 0 00-.25.25v12.5zM1.75 16A1.75 1.75 0 010 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 00.25-.25V8.285a.25.25 0 00-.111-.208l-1.055-.703a.75.75 0 11.832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0114.25 16h-3.5a.75.75 0 01-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 01-.75-.75V14h-1v1.25a.75.75 0 01-.75.75h-3zM3 3.75A.75.75 0 013.75 3h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 3.75zM3.75 6a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3 9.75A.75.75 0 013.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 9.75zM7.75 9a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM7 6.75A.75.75 0 017.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 017 6.75zM7.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z'
                      ></path>
                    </svg>
                  )}
                  <span className='max-w-[100px] truncate '>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className='z-20 relative bg-subtle w-full text-sm -mt-1 px-4 py-2 mb-4 shadow-[rgb(1,_4,_9)_0px_8px_24px_0px] border-web-gray border rounded-b-sm'>
            Nothing matches you{"'"}re search.
          </div>
        )}
      </div>
    </div>
  );
};
export default LinkDropdown;
