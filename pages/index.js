import React from 'react';
import ExploreHeader from '../components/Explore/Header';
import ExploreSearch from '../components/Explore/Search';
import ExploreHackathons from '../components/Explore/Hackathons';
import ExploreMarketplace from '../components/Explore/Marketplace';
import ExploreGoodFirstIssues from '../components/Explore/GoodFirstIssues';
import ExploreNewsletter from '../components/Explore/Newsletter';
import ExploreBlog from '../components/Explore/Blog';

export default function Index() {
  return (
    <main className='bg-dark-mode flex-col'>
      <ExploreHeader />
      <div className='flex flex-col items-center max-w-screen-2xl mx-auto px-5 lg:px-10'>
        <ExploreSearch />
        <ExploreHackathons />
        <ExploreMarketplace />
        <ExploreGoodFirstIssues />
        <ExploreNewsletter />
        <ExploreBlog />
      </div>
    </main>
  );
}
