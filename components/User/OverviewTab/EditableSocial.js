import React, { useContext, useState } from 'react';
import Pencil from '../../svg/pencil';
import StoreContext from '../../../store/Store/StoreContext';
import CopyAddressToClipboard from '../../Copy/CopyAddressToClipboard';
import ToolTipNew from '../../Utils/ToolTipNew';

const EditableSocial = ({ isOwner, social, user }) => {
  console.log('social', social);
  console.log('user', user);

  const [localSocial, setLocalSocial] = useState(social);
  const [isEditing, setIsEditing] = useState(false);
  const [appState] = useContext(StoreContext);
  const [inputValue, setInputValue] = useState(localSocial.link.replace('https://twitter.com/', ''));
  const [saveValue, setSaveValue] = useState('');
  const [validFormat, setValidFormat] = useState(false);
  console.log('localSocial', localSocial);

  console.log('inputValue', inputValue);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async (value, name) => {
    try {
      const githubId = user.github;
      const { updateUser } = await appState.openQPrismaClient.updateUser({ [name]: value, github: githubId });
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
    let linkValue = '';
    if (!isDiscord) {
      linkValue = 'https://twitter.com/' + value;
    }
    if (linkValue === '' || localSocial.parseFunction(linkValue)) {
      setValidFormat(true);
    } else {
      setValidFormat(false);
    }
    setSaveValue(linkValue || value);
  };
  const Icon = localSocial.icon;
  const isDiscord = localSocial.name === 'discord';
  const hasSocial = localSocial.parseFunction(localSocial.link);

  return (
    <>
      {
        <div className='w-full max-w-[300px] justify-between flex items-center gap-4 rounded-sm border border-web-gray p-4 px-8'>
          {isEditing ? (
            <div className='flex w-36 h-6 items-center input-field'>
              {!isDiscord && '@'}
              <input
                onChange={handleInputChange}
                value={inputValue}
                className='w-28 bg-transparent cursor-auto focus-within:outline-none'
              />
            </div>
          ) : (
            <div className=' flex gap-4'>
              <Icon className='inline' />
              <>
                {hasSocial && isDiscord && (
                  <CopyAddressToClipboard
                    styles='truncate w-36 inline'
                    noClip={true}
                    data={localSocial.parseFunction(localSocial.link)}
                  />
                )}

                {hasSocial && !isDiscord && (
                  <a
                    title={localSocial.name}
                    href={localSocial.link}
                    target='_blank'
                    className='w-36 inline text-link-colour hover:underline cursor-pointer ml-4 truncate'
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
                  onClick={() => handleSave(saveValue, localSocial.name)}
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
