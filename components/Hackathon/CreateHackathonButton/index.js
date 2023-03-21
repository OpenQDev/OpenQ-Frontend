import React, { useContext, useState } from 'react';
import StoreContext from '../../../store/Store/StoreContext';
import HackathonContext from '../HackathonStore/HackathonContext';
import LoadingIcon from '../../Loading/ButtonLoadingIcon';
import { useRouter } from 'next/router';
import { updateHackathonState } from '../../../services/utils/lib';

const CreateHackathonButton = ({ proAccountId, isEditing }) => {
  const CONFIRM = 'CONFIRM';
  const PENDING = 'PENDING';
  const SUCCESS = 'SUCCESS';
  const router = useRouter();
  const ERROR = 'ERROR';
  const [hackathonState] = useContext(HackathonContext);
  const [createHackathonResponse, setCreateHackathonResponse] = useState(CONFIRM);
  const [appState] = useContext(StoreContext);
  const EmptyLoader = () => <></>;
  const createOrUpdate = isEditing ? 'Updat' : 'Creat';
  const responseMap = {
    [CONFIRM]: { text: `${createOrUpdate}e Hackathon`, Loader: EmptyLoader },
    [PENDING]: { text: `${createOrUpdate}ing Hackathon`, Loader: LoadingIcon },
    [SUCCESS]: { text: 'Success!', Loader: EmptyLoader },
    [ERROR]: { text: 'Failed to Update', Loader: EmptyLoader },
  };
  const Loader = responseMap[createHackathonResponse].Loader;
  const handleCreate = async (e) => {
    e.preventDefault();
    const push = () => {
      router.push(`/pro/${proAccountId}?tab=Hackathons`);
    };
    updateHackathonState(hackathonState, appState, setCreateHackathonResponse, push);
  };

  return (
    <div className='flex my-8 gap-4'>
      <button onClick={handleCreate} className='btn-primary flex gap-2 '>
        {responseMap[createHackathonResponse].text}
        <Loader />
      </button>
      <button className='btn-default'>Preview</button>
    </div>
  );
};

export default CreateHackathonButton;
