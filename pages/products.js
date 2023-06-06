import React from 'react';
import Subnav from '../components/Sales/Subnav';
import ProductOverview from '../components/Sales/ProductOverview';

const Home = () => {
  return (
    <main className='explore pb-64'>
      <Subnav />
      <ProductOverview />
    </main>
  );
};

export default Home;
