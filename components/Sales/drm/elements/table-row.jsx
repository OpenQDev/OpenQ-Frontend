import React, { useEffect, useState, useRef } from 'react';
import LoadingSpinner from './loading-spinner';

const TableRow = ({ name, cols, type }) => {
  const [showColumns, setShowColumns] = useState([]);
  const firstElementRef = useRef(null);

  useEffect(() => {
    let timeoutIds = [];
    let observer;

    const handleTimeout = (index) => {
      const timeoutId = setTimeout(() => {
        setShowColumns((prevShowColumns) => [...prevShowColumns, index]);
      }, (index + 1) * 1000);
      timeoutIds.push(timeoutId);
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is visible, trigger column display
          handleTimeout(0);
          cols.slice(1).forEach((_, index) => handleTimeout(index + 1));
          observer.disconnect(); // Stop observing after the first intersection
        }
      });
    };

    if (firstElementRef.current) {
      // Initialize the Intersection Observer when ref is available
      observer = new IntersectionObserver(handleIntersection);
      observer.observe(firstElementRef.current);
    }

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      if (observer) {
        observer.disconnect();
      }
    };
  }, [cols, firstElementRef]);

  const getBackgroundColorClass = (col) => {
    if (type === 'status' || type === 'priority' || type === 'owner' || type === 'empty' || type === 'name') {
      if (col === 'lead') {
        return 'bg-green-300';
      } else if (col === 'churned') {
        return 'bg-red-300';
      } else if (type === 'name') {
        return 'underline';
      } else if (col === 'customer') {
        return 'bg-purple-300';
      } else if (col === 'cold') {
        return 'bg-cyan-300';
      } else if (col === 'high') {
        return 'bg-red-300';
      } else if (col === 'medium') {
        return 'bg-yellow-300';
      } else if (col === 'low') {
        return 'bg-cyan-300';
      } else if (type === 'owner') {
        return 'bg-gray-200';
      } else if (type === 'empty') {
        return 'text-white';
      }
    } else if (type === 'activity') {
      const percentage = parseInt(col.replace('%', ''), 10);
      if (percentage >= 0 && percentage < 50) {
        return 'bg-red-300';
      } else if (percentage >= 50 && percentage < 75) {
        return 'bg-yellow-300';
      } else if (percentage >= 75 && percentage <= 100) {
        return 'bg-green-300';
      }
    }
    return '';
  };

  return (
    <div className='flex flex-col w-full'>
      <div
        ref={firstElementRef}
        className={`flex flex-row items-center justify-between px-3 w-full bg-[#EEEEEE] border-t border-l border-b p-2 border-gray-300 ${
          type === 'name' ? 'rounded-tl-sm' : ''
        }`}
      >
        <div className={` text-xs font-medium ${type === 'empty' ? 'text-[#EEEEEE]' : 'text-gray-600'} `}>{name}</div>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke={`${type === 'empty' ? '#EEEEEE' : '#797979'}`}
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
          </svg>
        </div>
      </div>
      {cols.map((col, index) => (
        <div
          key={index}
          className={`flex border-b border-l border-gray-300 space-x-5 items-center p-2 ${
            showColumns.includes(index) ? '' : 'hidden'
          }`}
        >
          <div
            className={`text-gray-500 text-xs p-1 rounded-lg px-3 ${
              !type === 'empty' ? 'text-white' : 'text-gray-500'
            } ${!showColumns.includes(index + 1) && !showColumns.includes(9) ? '' : getBackgroundColorClass(col)}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {!showColumns.includes(index + 1) &&
            !showColumns.includes(9) &&
            type != 'empty' &&
            type != 'name' &&
            type != 'owner' &&
            type != 'problem' ? (
              <div className='flex flex-row space-x-3'>
                <div className='w-4'>
                  <LoadingSpinner />
                </div>
                <div className='w-4'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
                    <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'></path>
                  </svg>
                </div>
              </div>
            ) : (
              col
            )}
          </div>
        </div>
      ))}

      {type === 'name' ? (
        <div className='flex border-b border-l  border-gray-300 space-x-5 items-center p-1 '>
          <div className={`text-white text-xs p-1 rounded-lg px-3`} style={{ whiteSpace: 'nowrap' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='#8D8D8D'
              className='w-4 h-4 mb-1 -ml-2'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
          </div>
        </div>
      ) : (
        <div className='flex border-b border-l border-gray-300 space-x-5 items-center p-1 '>
          <div className={`text-white text-xs p-1 rounded-lg px-3`} style={{ whiteSpace: 'nowrap' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='white'
              className='w-4 h-4 mb-1'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
