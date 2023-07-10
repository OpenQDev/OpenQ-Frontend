import React, { useState } from 'react';

const FaqQuestion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row items-center justify-start border-b border-gray-300 pt-2 pb-5'>
        <div className='w-6 h-6 mt-2 mr-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='#533AED'
            className={`w-full h-full cursor-pointer ${isOpen ? 'transform rotate-180 -mt-4' : ''}`}
            onClick={toggleAnswer}
          >
            {isOpen ? (
              <path strokeLinecap='round' strokeLinejoin='round' d='M18 12H6' />
            ) : (
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            )}
          </svg>
        </div>
        <div className='flex flex-col'>
          <div className='text-black text-xl font-semibold pt-3 text-left'>{question}</div>
          {isOpen && <div className='text-gray-600 text-md text-left pt-3'>{answer}</div>}
        </div>
      </div>
    </div>
  );
};

export default FaqQuestion;
