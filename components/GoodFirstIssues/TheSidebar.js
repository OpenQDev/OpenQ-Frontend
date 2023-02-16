import React from 'react';
import LanguageFilter from './LanguageFilter';

export default function TheSidebar() {
  return (
    <aside className='px-6 pt-6 lg:pb-6 lg:max-w-sm'>
      <h3 className='font-bold'>Languages</h3>
      <LanguageFilter />
    </aside>
  );
}
