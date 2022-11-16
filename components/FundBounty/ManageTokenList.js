// Third
import React, { useContext, useState } from 'react';
import Image from 'next/image';

// Custom Hooks
import Toggle from '../Utils/Toggle';
import { ethers } from 'ethers';
import StoreContext from '../../store/Store/StoreContext';
import TokenDisplay from '../TokenBalances/TokenDisplay';

const ManageTokenList = ({ setCustomTokens, customTokens, setLists, lists, stream }) => {
  const [displayedTab, setDisplayedTab] = useState('Lists');
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState();
  const [appState] = useContext(StoreContext);
  const { tokenClient } = appState;
  const getAddressErrors = (address) => {
    if (!customTokens.some((token) => token.address === address)) {
      try {
        ethers.utils.getAddress(address.toLowerCase());
        return '';
      } catch (err) {
        return 'Not a valid address.';
      }
    }
    return "You've already entered this address";
  };

  const enterValue = async (e) => {
    if (e.key === 'Enter' && getAddressErrors(tokenInput) === '') {
      const token = await tokenClient.getToken(tokenInput);
      const fullToken = {
        address: tokenInput,
        symbol: token.symbol || `${tokenInput.slice(0, 4)}...${tokenInput.slice(35)}`,
        name: token.name || 'Custom Token',
        decimals: token.decimals || '18',
        path: token.path || token.logoURI,
      };

      setCustomTokens([...customTokens, fullToken]);
      setTokenInput('');
    }
  };

  const handleTokenInput = (e) => {
    setTokenInput(e.target.value);
    setError(getAddressErrors(e.target.value));
  };

  const setPolygon = () => {
    if (!stream) setLists({ ...lists, polygon: !lists.polygon });
  };

  const setOpenQ = () => {
    if (!stream) setLists({ ...lists, openq: !lists.openq });
  };

  return (
    <div className='flex items-center flex-col justify-start gap-4 h-[30rem]'>
      <Toggle toggleVal={displayedTab} toggleFunc={setDisplayedTab} names={['Lists', 'Tokens']}></Toggle>
      {displayedTab === 'Lists' ? (
        <>
          <div className='md:w-5/6 w-full  py-3 text-left px-4 border border-gray-700 rounded-sm flex items-center gap-4 justify-between'>
            <div className={'flex justify-center items-center h-10 w-10 rounded-full'}>
              <Image height={31} width={31} alt={'openq logo'} src={'/openq-logo-white-2.png'} />
            </div>
            <label htmlFor='includeOpenq' className='justify-self-start flex-1'>
              OpenQ List
            </label>
            <input
              onChange={setOpenQ}
              aria-label='include openq list'
              id='includeOpenq'
              checked={lists.openq}
              type='checkbox'
              className='checkbox cursor-pointer'
            />
          </div>
          <div className='md:w-5/6 w-full  py-3 mb-4.5 text-left px-4 border border-gray-700 rounded-sm flex items-center gap-4 justify-between'>
            <div className={'flex justify-center items-center h-10 w-10'}>
              <svg
                version='1.1'
                id='Layer_1'
                height='24'
                x='0px'
                y='0px'
                aria-label={'polygon logo'}
                fill='#8247e5'
                viewBox='0 0 38.4 33.5'
              >
                <g>
                  <path
                    className='st0'
                    d='M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
		c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
		c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
		L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z'
                  />
                </g>
              </svg>
            </div>
            <label htmlFor='includePolygon' className='justify-self-start flex-1 truncate'>
              Polygon.Technology List
            </label>
            <input
              onChange={setPolygon}
              id='includePolygon'
              aria-label='include polygon list'
              type='checkbox'
              checked={lists.polygon}
              className='checkbox cursor-pointer'
            />
          </div>
        </>
      ) : (
        <div className='w-full flex flex-col gap-2 content-start'>
          <label htmlFor='custom-tokens'>Add custom tokens</label>
          <input
            id='custom-tokens'
            onChange={handleTokenInput}
            onKeyDown={enterValue}
            value={tokenInput}
            className='w-full text-lg input-field-big mt-2 text-tinted'
            placeholder='0 x . . .'
          ></input>
          <p className='self-start text-tinted h-5'>
            {error || (tokenInput && 'Press Enter to add address to custom tokens.')}
          </p>
          <h4 className='self-start font-semibold pt-2 text-tinted'>Custom tokens</h4>
          <ul className='self-start h-16 mb-3 space-y-2 overflow-auto h-64 w-full border-b border-border-gray'>
            {customTokens.map((token) => (
              <li key={token.address} className='border-border-gray border pt-2 pl-4 rounded-sm w-min'>
                <TokenDisplay token={token} onSelect={() => {}} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default ManageTokenList;
