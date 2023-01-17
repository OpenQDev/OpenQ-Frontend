import React, { useState } from 'react';
import AddSkill from './AddSkill';

const LanguagesAndFrameworks = ({ user }) => {
  const languages = [
    'python',
    'java',
    'c++',
    'c#',
    'javascript',
    'ruby',
    'swift',
    'go',
    'scala',
    'kotlin',
    'perl',
    'php',
    'pascal',
    'objective-c',
    'r',
    'rust',
    'dart',
    'elixir',
    'erlang',
    'f#',
    'haskell',
    'html',
    'css',
    'clojure',
    'crystal',
    'elm',
    'groovy',
    'julia',
    'nim',
    'ocaml',
    'red',
    'scheme',
    'smalltalk',
    'sql',
  ];
  const frameworks = [
    'django',
    'flask',
    'rails',
    'laravel',
    'express',
    'spring',
    'asp.net',
    'react',
    'vue',
    'angular',
    'ember',
    'meteor',
    'sails',
    'sinatra',
    'express.js',
    'koa',
    'hapi',
    'socket.io',
    'next.js',
    'nuxt.js',
    'strapi',
    'prisma',
    'nestjs',
    'adonis',
    'loopback',
    'svelte',
    'tailwind',
    'bulma',
    'element-ui',
    'ant-design',
    'bootstrap',
    'material-ui',
    'semantic-ui',
  ];

  const [inputValue, setInputValue] = useState('');

  const [childInfo, setChildInfo] = useState([]);

  const categories = [
    ['languages', languages],
    ['frameworks', frameworks],
    ['otherRoles', []],
  ];

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter' && e.target.value != '') {
      checkCategory(e.target.value);
    }
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    // setValidUsername(true); Check if lang or framework here
  };

  const checkCategory = (input) => {
    let matches = false;
    categories.forEach((category) => {
      if (category[1].includes(input.toLowerCase())) {
        setChildInfo([inputValue, category[0]]);
        matches = true;
        return;
      }
    });
    if (!matches) setChildInfo([inputValue, 'otherRoles']);
  };

  return (
    <>
      <p className='font-semibold pt-4 py-2'>Tell us about your skills</p>
      <div className='flex flex-wrap'>
        {categories.map((category) => {
          return (
            <AddSkill
              key={category}
              category={category[0]}
              childInfo={childInfo}
              user={user}
              setInputValue={setInputValue}
            />
          );
        })}
      </div>
      <div className='flex justify-center gap-2 mt-2'>
        <input
          className='flex input-field w-full'
          placeholder='Programming languages, frameworks...'
          onChange={handleInputChange}
          onKeyDown={handleKeypress}
          value={inputValue}
        />
        <button onClick={() => checkCategory(inputValue)} className='btn-primary'>
          Add
        </button>
      </div>
    </>
  );
};

export default LanguagesAndFrameworks;
