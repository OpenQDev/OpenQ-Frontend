import React, { useContext } from 'react';
import StoreContext from '../../../../store/Store/StoreContext';
import Cross from '../../../svg/cross';

const AddSkill = ({ category, rolesInCategoriesState }) => {
  const [rolesInCategories, setRolesInCategories] = rolesInCategoriesState;
  const theseRoles = rolesInCategories[category];
  const [appState] = useContext(StoreContext);
  const { accountData } = appState;

  const updateApiAndState = async (newRoles, category) => {
    const newRolesAndCategory = { ...rolesInCategories, [category]: newRoles };
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

  const removeRole = (e, removedRole) => {
    e.preventDefault();
    const newRoles = theseRoles.filter((role) => role !== removedRole);
    updateApiAndState(newRoles, category);
  };
  return (
    <>
      {theseRoles?.map((role, index) => {
        return (
          <div className={`flex items-center gap-2 py-0.5 btn-default w-fit m-1`} key={index}>
            {role}{' '}
            <button onClick={(e) => removeRole(e, role)}>
              {role}
              <Cross />
            </button>
          </div>
        );
      })}
    </>
  );
};

export default AddSkill;
