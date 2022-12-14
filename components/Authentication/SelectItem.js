import React, { useContext } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const SelectItem = ({ fieldName, description }) => {
  const [appState] = useContext(StoreContext);
  const handleClick = async () => {
    const userValues = {
      github: accountData.github,
      [fieldName]: newRoles,
    };
    const updateUser = await appState.openQPrismaClient.updateUser(userValues);
    if (updateUser) {
      setRoles(newRoles);
    }
  };
  return (
    <button className={'btn-default m-1'} onClick={() => handleClick()}>
      {description}
    </button>
  );
};

export default SelectItem;
