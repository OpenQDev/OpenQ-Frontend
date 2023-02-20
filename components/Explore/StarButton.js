import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import { EyeIcon, StarIcon } from '@primer/octicons-react';

export default function StarButton({ count = 0, onClick, eye }) {
  const [appState] = useContext(StoreContext);
  const formattedCount = appState.utils.numberFormatter.format(count);
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };
  return (
    <button onClick={handleClick} className='text-xs border border-dark-1 bg-dark-3 !py-1 !px-3 !rounded'>
      {eye ? <EyeIcon className='w-3 h-3 mr-1' /> : <StarIcon className='w-3 h-3 mr-1' />} {formattedCount}
    </button>
  );
}
