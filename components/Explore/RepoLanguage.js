import React from 'react';

export default function Index({ language }) {
  return (
    <div className='flex items-center mr-3'>
      {
        (language) && (
          <>
            <span className='inline-block w-3 h-3 mr-1 rounded-full' style={{ backgroundColor: language.color }} />
            {language.name}
          </>
        )
      }
    </div>
  );
}
