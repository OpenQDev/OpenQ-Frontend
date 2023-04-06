import React, { useContext, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const SelectItem = ({ fieldName, items }) => {
  const [appState] = useContext(StoreContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const { accountData } = appState;

  const handleClick = async (item) => {
    let newItems = [];
    if (!selectedItems.includes(item.toLowerCase())) {
      newItems = [...selectedItems, item.toLowerCase()];
    } else {
      newItems = selectedItems.filter((i) => i !== item.toLowerCase());
    }
    const userValues = accountData.github
      ? {
          github: accountData.github,
          [fieldName]: newItems,
        }
      : {
          email: accountData.email,
          [fieldName]: newItems,
        };
    const updateUser = await appState.openQPrismaClient.updateUser(userValues);
    if (updateUser) {
      setSelectedItems(newItems);
    }
  };

  return (
    <>
      {items.map((item) => {
        return (
          <button
            className={`btn-default m-1 ${
              selectedItems.includes(item.toLowerCase()) && 'bg-[#30363d] border-[#8b949e]'
            }`}
            onClick={() => handleClick(item)}
            key={item}
          >
            {item}
          </button>
        );
      })}
    </>
  );
};

export default SelectItem;
