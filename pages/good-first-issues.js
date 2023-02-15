import React from 'react';
import TheSidebar from '../components/GoodFirstIssues/TheSidebar';
import TheList from '../components/GoodFirstIssues/TheList';
import { ReposProvider } from '../store/Gun/ReposProvider';

export default function GoodFirstIssues() {
  return (
    <main className='flex flex-col lg:flex-row lg:divide-x divide-gray-800 max-w-screen-md lg:max-w-screen-lg mx-auto'>
      <ReposProvider>
        <TheSidebar />
        <TheList />
      </ReposProvider>
    </main>
  );
}
