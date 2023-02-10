import React, { useContext, useState } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';
import StoreContext from '../../../../store/Store/StoreContext';
import Image from 'next/image';

const AddAlternativeMetadata = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [mintState, mintDispatch] = useContext(MintContext);
  const { altName, altUrl } = mintState;
  const [appState] = useContext(StoreContext);

  const handleNameChange = async (e) => {
    setGithubUrl(e.target.value);
    const githubOrgRegex = /https:\/\/github.com\/([a-zA-Z0-9-]+)\/?/;
    if (!githubOrgRegex.test(e.target.value)) return;
    const organization = await appState.githubRepository.getOrgByUrl(e.target.value);
    if (organization) {
      const dispatch = {
        type: 'SET_ALT_URL',
        payload: { name: organization.name || organization.login, avatarUrl: organization.avatarUrl },
      };
      await mintDispatch(dispatch);
    }
  };

  /* const handleFileChange = (e) => {
    const url = uploadFile(e.target.files[0]);
    const dispatch = {
      type: 'SET_ALT_URL',
      payload: url,
    };
    mintDispatch(dispatch);
  };*/
  return (
    <div className='flex flex-col gap-2 w-11/12 pb-4'>
      <div className='flex items-center gap-2 font-semibold'>
        <label htmlFor='sponsor'>Issue Sponsor (optional) </label>
        <ToolTipNew
          innerStyles={'w-40 whitespace-normal'}
          toolTipText={'Enter the github url of the sponsor of this issue.'}
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <input
        className='flex-1 input-field leading-loose w-full'
        id='sponsor'
        autoComplete='off'
        type='text'
        value={githubUrl}
        onChange={handleNameChange}
        placeholder='https://github.com/...'
      />

      {altUrl && (
        <div className='flex items-center gap-4 font-semibold border border-web-gray p-2 rounded-sm'>
          <Image className='rounded-full' alt={`${altName} avatar`} src={altUrl} width={48} height={48} />
          <span className='text-2xl'> {altName}</span>
        </div>
      )}
    </div>
  );
};

export default AddAlternativeMetadata;
