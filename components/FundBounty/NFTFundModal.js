import React, { useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import SelectableNFT from './SelectableNFT';
const NFTFundModal = ({ nfts, setPickedNft }) => {
  const [showModal, setShowModal] = useState();
  const [selectedNft, setSelectedNft] = useState();
  const pickNft = () => {
    setPickedNft(selectedNft);
    setShowModal(false);
  };
  return (
    <>
      <div>
        <button onClick={() => setShowModal(true)} className='flex gap-2 btn-default content-center items-center '>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16' className='fill-muted'>
            <path
              fillRule='evenodd'
              d='M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z'
            ></path>
          </svg>
          <svg xmlns='http://www.w3.org/2000/svg' className='fill-primary' viewBox='0 0 16 16' width='16' height='16'>
            <path
              fillRule='evenodd'
              d='M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z'
            ></path>
          </svg>
        </button>
      </div>

      {showModal && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden  text-primary overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='min-w-[320px] max-h-[650px] overflow-y-scroll w-full max-w-[780px] p-8 bg-dark-mode rounded-md'>
              <h2 className='text-center text-4xl pb-8'>Select NFT</h2>
              <div className='text-primary text-[0.8rem] grid  gap-8 grid-cols-[repeat(_auto-fit,_minmax(200px,_1fr)_)] yeet'>
                {nfts.map((nft, index) => {
                  console.log('exec');
                  return (
                    <SelectableNFT
                      pickNft={pickNft}
                      key={index}
                      nft={nft}
                      setSelectedNft={setSelectedNft}
                      selectedNft={selectedNft}
                    />
                  );
                })}
              </div>
            </div>
          </div>{' '}
          ><div className='bg-overlay fixed inset-0'></div>
        </>
      )}
    </>
  );
};
export default NFTFundModal;
