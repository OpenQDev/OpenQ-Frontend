import React, { useState, useContext } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';

const Product = ({ product, apiSecret }) => {
  const [appState] = useContext(StoreContext);
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState(product.name);

  const saveName = async () => {
    const id = product.id;
    try {
      setName(name);
      await appState.openQPrismaClient.updateProduct(apiSecret, { id, name });
      setEditable(false);
    } catch (error) {
      appState.logger.error(error, 'Product.js1');
    }
  };
  return (
    <div>
      <div className='flex w-full justify-between items-center'>
        {editable ? (
          <input value={name} className='input-field my-4' onChange={(e) => setName(e.target.value)} />
        ) : (
          <div>{name}</div>
        )}
        {<div className='my-4'>{product.id}</div>}
        {editable ? (
          <button className='btn-primary my-2 px-8' onClick={saveName}>
            Save
          </button>
        ) : (
          <button className='btn-primary my-2 px-8' onClick={() => setEditable(true)}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
