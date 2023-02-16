import React from 'react';

const githubLanguageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  PHP: '#4F5D95',
  C: '#555555',
  Go: '#00ADD8',
  Ruby: '#701516',
  Shell: '#89e051',
  Swift: '#ffac45',
  Starlark: '#76d275',
  Cython: '#fedf5b',
  Dockerfile: '#384d54',
  'C#': '#178600',
  'C++': '#f34b7d',
  'Objective-C': '#438eff',
  'Objective-C++': '#6866fb',
  Batchfile: '#C1F12E',
  CMake: '#DA3434',
  XSLT: '#EB8CEB',
  Awk: '#c30f0f',
  PowerShell: '#012456',
};

export default function Index({ language, color }) {
  color = color || githubLanguageColors[language] || '#cccccc';
  return (
    <div className='flex items-center mr-3'>
      <span className='inline-block w-3 h-3 mr-1 rounded-full' style={{ backgroundColor: color }} />
      {language}
    </div>
  );
}
