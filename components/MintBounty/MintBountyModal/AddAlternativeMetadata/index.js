import React, { useContext } from 'react';
import ToolTipNew from '../../../Utils/ToolTipNew';
import MintContext from '../../MintContext';

const AddAlternativeMetadata = () => {
  const [mintState, mintDispatch] = useContext(MintContext);
  const { altName, altUrl } = mintState;

  const handleNameChange = (e) => {
    const dispatch = {
      type: 'SET_ALT_NAME',
      payload: e.target.value,
    };
    mintDispatch(dispatch);
  };
  const uploadFile = () => {
    return 'https://camo.githubusercontent.com/0775cef0c7f6bf2b929f29ae6377e9c183f5313be9d8a333ed177ab03def08d5/68747470733a2f2f302e67726176617461722e636f6d2f6176617461722f30316562343730613833386666386133303636346265376562663464303638643f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d6726733d313430';
  };

  const handleFileChange = (e) => {
    const url = uploadFile(e.target.files[0]);
    const dispatch = {
      type: 'SET_ALT_URL',
      payload: url,
    };
    mintDispatch(dispatch);
  };
  return (
    <div className='flex flex-col gap-2 w-11/12 pb-4'>
      <div className='flex items-center gap-2 font-semibold'>
        <label htmlFor='sponsor'>Issue Sponsor</label>
        <ToolTipNew innerStyles={'w-40 whitespace-normal'} toolTipText={'Enter the name of the sponsor of this issue.'}>
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
        value={altName}
        onChange={handleNameChange}
      />
      <div className='flex leading-none gap-2 font-semibold'>
        Upload Alternative Image
        <ToolTipNew
          innerStyles={'w-40 whitespace-normal'}
          toolTipText={"Upload an image for your bounty, if you don't the image of the repository owner will be used."}
        >
          <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 text-sm box-content text-center font-bold text-primary'>
            ?
          </div>
        </ToolTipNew>
      </div>
      <label
        style={{ backgroundImage: `url(${altUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
        className={`${
          altUrl ? 'aspect-square w-1/2 margin-auto' : 'h-24 w-full self-start'
        } object-cover self-center cursor-pointer border border-web-gray bg-image rounded-sm bg-input-bg flex justify-center content-center items-center`}
      >
        {!altUrl && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className=' fill-web-gray w-12 h-12'
            viewBox='0 0 24 24'
            width='24'
            height='24'
          >
            <path d='m4.97 8.47 6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12.5 4.56v12.19a.75.75 0 0 1-1.5 0V4.56L6.03 9.53a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042ZM4.75 22a.75.75 0 0 1 0-1.5h14.5a.75.75 0 0 1 0 1.5Z'></path>
          </svg>
        )}

        <input onChange={handleFileChange} className='hidden' type='file' id='myFile' name='filename' />
      </label>
    </div>
  );
};

export default AddAlternativeMetadata;
