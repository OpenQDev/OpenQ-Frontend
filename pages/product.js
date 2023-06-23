import React from 'react';
import Subnav from '../components/Sales/Subnav';
import ProductOverview from '../components/Sales/ProductOverview';

const Home = () => {
  return (
    <main className='explore pb-64'>
      <div className='sticky top-0 z-50'>
        <Subnav />
      </div>
      <ProductOverview />
    </main>
  );
};

export default Home;

export async function getServerSideProps() {
  return {
    notFound: true
  };
}
