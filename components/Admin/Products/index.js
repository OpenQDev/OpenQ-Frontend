import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Product from './Product/index.js';

const Products = ({ apiSecret, products, setProducts }) => {
  const [appState] = useContext(StoreContext);
  const [name, setName] = useState('');
  const createProduct = async (e) => {
    e.preventDefault();
    const { createProduct } = await appState.openQPrismaClient.createProduct(apiSecret, { name });
    setProducts([createProduct, ...products]);
    setName('');
  };
  const handleInput = (e) => {
    setName(e.target.value);
  };
  // get products

  return (
    <div>
      <h2>Products</h2>
      <div className='my-4 border-web-gray border p-4'>
        <h3>Current Products</h3>
        {products.map((product, index) => (
          <Product apiSecret={apiSecret} key={index} product={product} />
        ))}
      </div>
      <div className='my-4 border-web-gray border p-4'>
        <h3>Create New Product</h3>
        <form className='flex justify-between w-full'>
          <input onChange={handleInput} value={name} className='input-field' />
          <button onClick={createProduct} className='btn-primary'>
            Create New Product
          </button>
        </form>
      </div>
    </div>
  );
};
export default Products;
