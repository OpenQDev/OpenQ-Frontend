import React from 'react';
import { useLanguageFilter, useSetLanguageFilter } from '../../store/Store/GoodFirstIssuesProvider';

export default function LanguageFilterLanguage({ name, count }) {
  const enabledLanguages = useLanguageFilter();
  const setEnabledLanguages = useSetLanguageFilter();

  const toggle = () => {
    if (enabledLanguages.includes(name)) {
      setEnabledLanguages(enabledLanguages.filter((language) => language !== name));
    } else {
      setEnabledLanguages([...enabledLanguages, name]);
    }
  };

  const isEnabled = enabledLanguages.includes(name);

  const classNames = [
    isEnabled ? 'bg-violet-800' : 'bg-[#161b22]',
    'hover:bg-violet-800',
    'text-gray-300',
    'hover:text-white',
    'px-2',
    'py-1',
    'rounded',
    'space-x-2',
    'cursor-pointer',
    'text-sm',
  ];

  return (
    <span className={classNames.join(' ')} onClick={toggle}>
      <span>{name}</span>
      <span className='text-white opacity-50'>{count}</span>
    </span>
  );
}
