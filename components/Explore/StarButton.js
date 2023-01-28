import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';
import { StarIcon } from '@primer/octicons-react';

export default function StarButton({ count = 0 }) {
  const [appState] = useContext(StoreContext);
  const formattedCount = appState.utils.numberFormatter.format(count);

  return (
    <button className='text-xs border border-dark-1 bg-dark-3 !py-1 !px-3 !rounded'>
      <StarIcon className='w-3 h-3 mr-1' /> {formattedCount}
    </button>
  );
}
