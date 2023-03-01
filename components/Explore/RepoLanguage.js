import React from 'react';

export default function Index({ language, className }) {
  return (
    <div className={`flex items-center mr-3 ${className}`}>
      {language && (
        <>
          <span className='inline-block w-3 h-3 mr-1 rounded-full' style={{ backgroundColor: language.color }} />
          {language.name}
        </>
      )}
    </div>
  );
}
