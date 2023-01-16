import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import Cross from '../../svg/cross';

const AddSkill = ({ category, user, childInfo, setInputValue }) => {
  const [roles, setRoles] = useState(user[category].map((item) => item.toLowerCase()));
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;

  useEffect(() => {
    console.log('childInfo', childInfo);
    if (childInfo[1] == category) {
      addRole(childInfo[0]);
    }
  }, [childInfo]);

  const addRole = async (role) => {
    const emptyOrExists = roles.includes(role.toLowerCase()) || '';
    if (emptyOrExists) return;
    const newRoles = [...roles, role.toLowerCase()];
    console.log('newRoles', newRoles);
    try {
      await updateApiAndState(newRoles, category);
    } catch (err) {
      appState.logger.error(err, accountData.id, 'AddSkill.js1');
    }
    setInputValue('');
  };
  const removeRole = (e, removedRole) => {
    e.preventDefault();
    const newRoles = roles.filter((role) => role !== removedRole);
    updateApiAndState(newRoles, category);
  };

  const updateApiAndState = async (newRoles, category) => {
    const userValues = accountData.github
      ? {
          github: accountData.github,
          [category]: newRoles,
        }
      : {
          email: accountData.email,
          [category]: newRoles,
        };
    const updateUser = await appState.openQPrismaClient.updateUser(userValues);
    if (updateUser) {
      setRoles(newRoles);
    }
  };
  return (
    <>
      {roles?.map((role, index) => {
        return (
          <div className={`flex items-center gap-2 py-0.5 btn-default w-fit m-1`} key={index}>
            {role}{' '}
            <button onClick={(e) => removeRole(e, role)}>
              <Cross />
            </button>
          </div>
        );
      })}
    </>
  );
};

export default AddSkill;
