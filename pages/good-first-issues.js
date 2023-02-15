import React from 'react';
import TheSidebar from '../components/GoodFirstIssues/TheSidebar';
import TheList from '../components/GoodFirstIssues/TheList';
import { ReposProvider } from '../store/Gun/ReposProvider';

export default function GoodFirstIssues() {
  return (
    <>
      <div className='text-center bg-[#161B22] py-14 border-t border-web-gray'>
        <div className='text-2xl font-bold'>Good First Web3 Issues</div>
        <div className='text-gray-500 text-md'>GitHub issues to get you started in Web3.</div>
      </div>
      <main className='flex flex-col lg:flex-row lg:divide-x divide-gray-800 max-w-screen-md lg:max-w-screen-lg mx-auto'>
        <ReposProvider>
          <TheSidebar />
          <TheList />
        </ReposProvider>
      </main>
    </>
  );
}
