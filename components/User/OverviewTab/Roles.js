import React, { useContext, useState } from 'react';
import Cross from '../../svg/cross';
import StoreContext from '../../../store/Store/StoreContext';

const Roles = ({ defaultRoles, category, user }) => {
  const [roles, setRoles] = useState(defaultRoles);
  const [inputValue, setInputValue] = useState('');
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = loggedId == user.id;
  const categoryToFieldName = {
    'Dev Role': 'devRoles',
    Framework: 'frameworks',
    Language: 'languages',
    'Other Role': 'otherRoles',
  };
  const addRole = async (e, role) => {
    e.preventDefault();
    const emptyOrExists = roles.includes(role.toLowerCase()) || '';
    if (emptyOrExists) return;
    e.preventDefault();
    const newRoles = [...roles, role.toLowerCase()];
    try {
      await updateApiAndState(newRoles);
    } catch (err) {
      appState.logger.error(err);
    }
    setInputValue('');
  };

  const removeRole = (e, removedRole) => {
    e.preventDefault();
    const newRoles = roles.filter((role) => role !== removedRole);
    updateApiAndState(newRoles);
  };

  const updateApiAndState = async (newRoles) => {
    const fieldName = categoryToFieldName[category];
    const userValues = accountData.github
      ? {
          github: accountData.github,
          [fieldName]: newRoles,
        }
      : {
          email: accountData.email,
          [fieldName]: newRoles,
        };
    const updateUser = await appState.openQPrismaClient.updateUser(userValues);
    if (updateUser) {
      setRoles(newRoles);
    }
  };
  return (
    <>
      {(roles?.length > 0 || isOwner) && (
        <li className='py-6'>
          <h4 className='font-bold'>{category}s</h4>
          <div>
            <div className='grid gap-4 py-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] '>
              {roles?.map((role, index) => {
                return (
                  <div
                    className={`flex items-center gap-2  py-0.5  ${
                      isOwner ? 'btn-default' : 'btn-default-disabled'
                    } w-fit`}
                    key={index}
                  >
                    {role}{' '}
                    {isOwner && (
                      <button onClick={(e) => removeRole(e, role)}>
                        <Cross />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {isOwner && (
              <>
                <h4 className='font-bold'>Add {category}</h4>
                <input
                  onSubmit={(e) => e.preventDefault()}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className='input-field inline p-[7px] my-4 mr-4'
                  id='add role'
                ></input>
                <button onClick={(e) => addRole(e, inputValue)} className='btn-primary'>
                  Add
                </button>
              </>
            )}
          </div>
        </li>
      )}
    </>
  );
};

export default Roles;
