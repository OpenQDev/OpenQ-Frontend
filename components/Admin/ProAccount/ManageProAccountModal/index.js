import React, { useState, useContext, useEffect } from 'react';
import ModalLarge from '../../../Utils/ModalLarge';
import StoreContext from '../../../../store/Store/StoreContext';

const ManageProAccountModal = ({ proAccount, products, apiSecret }) => {
  const [appState] = useContext(StoreContext);
  const [showProModal, setShowProModal] = useState(false);
  const [myProducts, setMyProducts] = useState(proAccount.permissionedProducts.nodes);
  const [selectedProduct, setSelectedProduct] = useState();
  useEffect(() => {
    setSelectedProduct(products[0].id);
  }, [products]);
  const openProAccountModal = () => {
    setShowProModal(true);
  };
  const handleSelectChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleAddProduct = async () => {
    // add product to myProducts and openQPrismaClient if I don't have it.
    const product = products.find((product) => product.id === selectedProduct);
    const alreadyHasProduct = myProducts.find((myProduct) => myProduct.id === product.id);
    if (product && !alreadyHasProduct) {
      // send mutation
      await appState.openQPrismaClient.addProductToProAccount(apiSecret, {
        proAccountId: proAccount.id,
        productId: product.id,
      });
      setMyProducts([...myProducts, product]);
    }
  };

  return (
    <div className='my-16 p-4  border-web-gray border'>
      <div className='flex w-full justify-between content-center items-center'>
        <div>{proAccount.name}</div>

        <button onClick={openProAccountModal} className='btn-primary'>
          Update Pro Account
        </button>
      </div>
      <div>
        {showProModal && (
          <div onClick={(e) => e.preventDefault()}>
            <ModalLarge
              title={`Manage ${proAccount.name}'s proAccount`}
              resetState={() => null}
              setShowModal={setShowProModal}
            >
              <div className='p-8'>
                {myProducts.map((node, index) => (
                  <div key={index} className='flex  w-full justify-between'>
                    <div>{node.name}</div>
                    <div>{node.id}</div>
                  </div>
                ))}
              </div>

              <div className='w-full flex justify-between p-6'>
                <select onChange={handleSelectChange} className='w-1/2 input-field'>
                  {products.map((product, index) => (
                    <option key={index} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>{' '}
                <button onClick={handleAddProduct} className='btn-primary'>
                  Add Product
                </button>
              </div>
            </ModalLarge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProAccountModal;
