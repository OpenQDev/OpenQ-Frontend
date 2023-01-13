import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
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
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const categories = ['languages', 'frameworks'];

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter') {
      updateApiAndState(inputValue, 'languages'); // pass to API with github or email + new skill inputvalue + which category to add it to
    }
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    // setValidUsername(true); Check if lang or framework here
  };

  const updateApiAndState = async (newItem, fieldName) => {
    const newList = [...user[fieldName], newItem];
    const userValues = accountData.github
      ? {
          github: accountData.github,
          [fieldName]: newList,
        }
      : {
          email: accountData.email,
          [fieldName]: newList,
        };
    const updateUser = await appState.openQPrismaClient.updateUser(userValues);
    if (updateUser) {
      // setRoles(newList);
    }
  };

  return (
    <>
      <p className='font-semibold pt-4 py-2'>Tell us about your skills</p>
      {categories.map((category) => {
        return (
          <div key={category}>
            <AddSkill category={category} list={user[category]} />
          </div>
        );
      })}
      <input
        className='input-field w-full'
        placeholder='Programming languages, frameworks...'
        onChange={handleInputChange}
        onKeyDown={handleKeypress}
        value={inputValue}
      />
    </>
  );
};

export default LanguagesAndFrameworks;
