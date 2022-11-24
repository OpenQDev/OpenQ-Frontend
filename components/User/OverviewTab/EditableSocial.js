import React, { useContext, useState } from 'react';
import Pencil from '../../svg/pencil';
import StoreContext from '../../../store/Store/StoreContext';
import { ethers } from 'ethers';
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';
import ToolTipNew from '../../Utils/ToolTipNew';

const EditableSocial = ({ isOwner, social, user }) => {
  const [localSocial, setLocalSocial] = useState(social);
  const [isEditing, setIsEditing] = useState(false);
  const [appState] = useContext(StoreContext);
  const [inputValue, setInputValue] = useState(localSocial.link);
  const [validFormat, setValidFormat] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async (value, name) => {
    try {
      const address = ethers.utils.getAddress(user.id);
      const { updateUser } = await appState.openQPrismaClient.updateUser({ [name]: value, address });
      if (updateUser) {
        const newLink = updateUser[name];
        setLocalSocial({ ...localSocial, link: newLink });
        setIsEditing(false);
      }
    } catch (err) {
      setIsEditing(false);
    }
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    if (value === '' || localSocial.parseFunction(value)) {
      setValidFormat(true);
    } else {
      setValidFormat(false);
    }
  };
  const Icon = localSocial.icon;
  const isDiscord = localSocial.name === 'discord';
  const hasSocial = localSocial.parseFunction(localSocial.link);

  return (
    <>
      {
        <div className='w-full max-w-[300px] justify-between flex gap-4 rounded-sm border border-web-gray p-4 px-8'>
          {isEditing ? (
            <div>
              <input
                onChange={handleInputChange}
                value={inputValue}
                className='w-36 bg-transparent rounded-sm border-web-gray border h-6 outline-transparent focus-within:shadow-none input-field curosr-auto'
              />
            </div>
          ) : (
            <div className=' flex gap-4'>
              <Icon className='inline' />
              <>
                {hasSocial && isDiscord && (
                  <CopyAddressToClipboard
                    styles='w-36 inline'
                    noClip={true}
                    data={localSocial.parseFunction(localSocial.link)}
                  />
                )}

                {hasSocial && !isDiscord && (
                  <a
                    title={localSocial.name}
                    href={localSocial.link}
                    target='_blank'
                    className='text-link-colour hover:underline cursor-pointer ml-4 truncate'
                    rel='noreferrer'
                  >
                    {localSocial.parseFunction(localSocial.link)}
                  </a>
                )}
                {!hasSocial && <div>-</div>}
              </>
            </div>
          )}
          {isOwner &&
            (isEditing ? (
              <ToolTipNew hideToolTip={validFormat} toolTipText={`Input is not a ${localSocial.name} link`}>
                <button
                  disabled={!validFormat}
                  className={validFormat ? 'btn-primary text-sm' : 'btn-default text-sm cursor-not-allowed'}
                  onClick={() => handleSave(inputValue, localSocial.name)}
                >
                  Update
                </button>
              </ToolTipNew>
            ) : (
              <button className='h-67' onClick={handleEdit}>
                <Pencil className={'fill-muted'} />
              </button>
            ))}
        </div>
      }
    </>
  );
};
export default EditableSocial;
