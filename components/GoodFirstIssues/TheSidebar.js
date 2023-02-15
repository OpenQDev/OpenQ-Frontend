import React from 'react';
import LanguageFilter from './LanguageFilter';

export default function TheSidebar() {
  return (
    <aside className='p-4 lg:max-w-sm'>
      <h3 className='mt-9'>languages</h3>
      <LanguageFilter />
    </aside>
  );
}
