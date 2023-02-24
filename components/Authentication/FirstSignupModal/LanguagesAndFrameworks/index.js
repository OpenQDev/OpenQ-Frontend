import React, { useEffect, useState, useContext } from 'react';
import AddSkill from '../AddSkill';
import StoreContext from '../../../../store/Store/StoreContext';

const LanguagesAndFrameworks = ({ user }) => {
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
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
  const categories = {
    languages: languages,
    frameworks: frameworks,
    otherRoles: [],
  };

  const updateApiAndState = async (newRoles, accountData, appState) => {
    const newRolesAndCategory = { ...rolesInCategories, ...newRoles };
    const userValues = accountData.github
      ? {
          github: accountData.github,
          ...newRolesAndCategory,
        }
      : {
          email: accountData.email,
          ...newRolesAndCategory,
        };
    await appState.openQPrismaClient.updateUser(userValues);
    setRolesInCategories(newRolesAndCategory);
  };

  const rolesInCategoriesState = useState({
    languages: [],
    frameworks: [],
    otherRoles: [],
  });
  const [rolesInCategories, setRolesInCategories] = rolesInCategoriesState;
  const [inputValue, setInputValue] = useState('');

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter' && e.target.value != '') {
      checkCategory(e.target.value);
    }
  };
  useEffect(() => {
    const addUsersLanguages = async () => {
      await checkCategory(user.recentLanguages.map((lang) => lang.toLowerCase()));
    };
    addUsersLanguages();
  }, [user]);
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    // setValidUsername(true); Check if lang or framework here
  };
  const checkCategory = async (inputs) => {
    let updateObj = { ...rolesInCategories };
    const createUpdateObj = (nameOfCategory, updateObj, input) => {
      updateObj = { ...updateObj, [nameOfCategory]: [...updateObj[nameOfCategory], input] };
      return updateObj;
    };
    const categoriesArr = Object.entries(categories);
    for (const input of inputs) {
      let matches = false;
      for (const category of categoriesArr) {
        const nameOfCategory = category[0];
        const listOfRolesInCategory = category[1];
        if (listOfRolesInCategory.includes(input.toLowerCase())) {
          updateObj = createUpdateObj(nameOfCategory, updateObj, input);
          matches = true;
        }
      }
      if (!matches) updateObj = createUpdateObj('otherRoles', updateObj, input);
    }
    await updateApiAndState(updateObj, accountData, appState);
    setInputValue('');
  };
  return (
    <>
      <p className='font-semibold pt-4 py-2'>Tell us about your skills</p>
      <div className='flex flex-wrap'>
        {Object.entries(rolesInCategories).map((category) => {
          const nameOfCategory = category[0];
          return (
            <AddSkill
              rolesInCategoriesState={rolesInCategoriesState}
              key={category}
              category={nameOfCategory}
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
        <button onClick={() => checkCategory([inputValue])} className='btn-primary'>
          Add
        </button>
      </div>
    </>
  );
};

export default LanguagesAndFrameworks;
