import React from 'react';
import AnimateIn from './base/animateIn';

const StepThreeContent = () => {
  return (
    <div className='flex h-full flex-1 flex-col text-black'>
      <div className='flex gap-4 border-b'>
        <div className='flex-1 border-b-2 py-3 focus:outline-none border-gray-600 bg-white'>
          <div className='flex gap-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
              className=' h-5 w-5  stroke-current'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
              ></path>
            </svg>
            Overview
          </div>
        </div>
        <div className='flex-1 border-b-2 py-3 focus:outline-none border-transparent hover:bg-white/[0.12]'>
          <div className='flex gap-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
              className=' h-5 w-5  stroke-current'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
              ></path>
            </svg>
            <span className='hidden sm:inline'>Commit Activity</span>
            <span className='sm:hidden inline'>Commits</span>
          </div>
        </div>
        <div className='flex-1 hidden xl:block border-b-2 py-3 focus:outline-none border-transparent hover:bg-white/[0.12]'>
          <div className='flex gap-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
              className=' h-5 w-5  stroke-current'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25'
              ></path>
            </svg>
            Dependencies
          </div>
        </div>
        <div className='flex-1 hidden 2xl:block border-b-2 py-3 focus:outline-none border-transparent hover:bg-white/[0.12]'>
          <div className='flex gap-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
              className=' h-5 w-5  stroke-current'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
              ></path>
            </svg>
            Contributors
          </div>
        </div>
      </div>
      <div className='mt-8 flex grow flex-col overflow-y-auto rounded-t-lg border-x border-t bg-gray-100'>
        <div className='flex grow flex-col focus:outline-none'>
          <div className='flex space-x-1 bg-white'>
            <div className='w-full py-3 text-center font-semibold focus:outline-none bg-offwhite'>
              <div>Activity</div>
            </div>
            <div className='w-full  py-3 text-center font-semibold focus:outline-none  text-muted hover:bg-white/[0.12]'>
              <div>Notes</div>
            </div>
            <div className='w-full  py-3 text-center font-semibold focus:outline-none  text-muted hover:bg-white/[0.12]'>
              <div>Emails</div>
            </div>
            <div className='w-full hidden sm:block max-w-[25%] py-3 text-center font-semibold focus:outline-none  text-muted hover:bg-white/[0.12]'>
              <div>Logs</div>
            </div>
          </div>
          <div className='w-full  px-8 py-6 focus:outline-none'>
            <div className='flex flex-col gap-y-8'>
              August 2023
              <AnimateIn delay={750} direction={'left'}>
                <div className='rounded-lg border border-divider bg-white p-6'>
                  <div className=' items-start gap-2'>
                    <div>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        role='img'
                        className=' h-5 w-5  stroke-current text-[rgb(83,_59,_237)]'
                        viewBox='0 0 16 16'
                        width='16'
                        height='16'
                        fill='currentColor'
                        style={{
                          display: 'inline-block',
                          userSelect: 'none',
                          verticalAlign: 'text-bottom',
                          overflow: 'visible',
                        }}
                      >
                        <path d='M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z'></path>
                      </svg>
                    </div>
                    <h5>
                      <strong>Note</strong> <div>by Christopher</div>
                    </h5>
                    <div
                      style={{
                        position: 'fixed',
                        top: '1px',
                        left: '1px',
                        width: '1px',
                        height: '0px',
                        padding: '0px',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0px, 0px, 0px, 0px)',
                        whiteSpace: 'nowrap',
                        borderWidth: '0px',
                        display: 'none',
                      }}
                    ></div>
                  </div>
                  <div className='mt-4 whitespace-pre-wrap'>This a Note</div>
                </div>
              </AnimateIn>
              <AnimateIn margin='300px' delay={1500} direction={'left'}>
                <div className='rounded-lg border border-divider bg-white p-6'>
                  <div className=' items-start gap-2'>
                    <div>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        role='img'
                        className=' h-5 w-5  stroke-current text-[rgb(83,_59,_237)]'
                        viewBox='0 0 16 16'
                        width='16'
                        height='16'
                        fill='currentColor'
                        style={{
                          display: 'inline-block',
                          userSelect: 'none',
                          verticalAlign: 'text-bottom',
                          overflow: 'visible',
                        }}
                      >
                        <path d='M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z'></path>
                      </svg>
                    </div>
                    <div>
                      <strong>Email</strong>
                      <strong> - This is a Subject </strong>
                      <div>from tom.morris@openq.dev</div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <strong>Jane Doe</strong>
                        <div>to: janedoe@mydomain.com</div>
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'fixed',
                        top: '1px',
                        left: '1px',
                        width: '1px',
                        height: '0px',
                        padding: '0px',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0px, 0px, 0px, 0px)',
                        whiteSpace: 'nowrap',
                        borderWidth: '0px',
                        display: 'none',
                      }}
                    ></div>
                  </div>
                  <div className='mt-4 whitespace-pre-wrap'>This is the text</div>
                </div>
              </AnimateIn>
              <div className='flex'>
                <div className=' rounded-r-none bg-offwhite text-muted'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    aria-hidden='true'
                    className=' h-5 w-5  stroke-current'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5'></path>
                  </svg>
                </div>
                <div className='h-min rounded-full border-divider bg-vlight px-2 py-0.5 text-sm'>1</div>
                <div className=' rounded-l-none  bg-offwhite text-muted'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    aria-hidden='true'
                    className=' h-5 w-5  stroke-current'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5'></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StepThreeContent;
