// Third party
import React, { useState, useContext } from 'react';
import Pencil from '../../../svg/pencil';
import ToolTipNew from '../../../Utils/ToolTipNew';
import StoreContext from '../../../../store/Store/StoreContext';
import AuthContext from '../../../../store/AuthStore/AuthContext';
// Custom

const Username = ({ user, firstSignup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(user.username);
  const [localUsername, setLocalUsername] = useState(user.username);
  const [appState] = useContext(StoreContext);
  const [validUsername, setValidUsername] = useState(false);
  const [authState] = useContext(AuthContext);
  const { accountData } = appState;
  const loggedId = accountData?.id;
  const isOwner = authState.isAuthenticated && loggedId == user.id;

  // VALIDUSERNAME CHECK
  // Make sure also update when logged in with email (and same for ediatble socials)

  const handleEdit = () => {
    if (isOwner) {
      setIsEditing(true);
    }
  };
  const handleSave = async () => {
    try {
      const githubId = user.github;
      const { updateUser } = githubId
        ? await appState.openQPrismaClient.updateUser({ username: inputValue, github: githubId })
        : await appState.openQPrismaClient.updateUser({ username: inputValue, email: user.email });
      if (updateUser) {
        setLocalUsername(inputValue);
        setIsEditing(false);
      }
    } catch (err) {
      setIsEditing(false);
    }
  };
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === 'Enter') {
      handleSave(inputValue);
    }
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    setValidUsername(true); // make condition here
  };

  return (
    <div
      className={`${
        !firstSignup
          ? 'px-8 py-6 gap-6 flex flex-wrap items-stretch w-full font-semibold text-lg'
          : 'flex items-center '
      } `}
    >
      <div className='flex-1 flex-row'>
        {!firstSignup && <div className='pb-2'>Username</div>}
        {!isEditing ? (
          <div className='flex w-fit items-center gap-4'>
            <div className='font-normal flex-1'>{localUsername}</div>
            {isOwner && (
              <button className='h-67' onClick={handleEdit}>
                <Pencil className={'fill-muted'} />
              </button>
            )}
          </div>
        ) : isOwner ? (
          <div className='flex w-36 items-center gap-4'>
            <input
              onChange={handleInputChange}
              onKeyDown={handleKeypress}
              value={inputValue}
              className='input-field pl-4 cursor-auto focus-within:outline-none'
            />
            <ToolTipNew hideToolTip={validUsername} toolTipText={'Username is not valid'}>
              <button
                disabled={!validUsername}
                className={validUsername ? 'btn-primary text-sm' : 'btn-default text-sm cursor-not-allowed'}
                onClick={() => handleSave(inputValue)}
              >
                Update
              </button>
            </ToolTipNew>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Username;
