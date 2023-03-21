import React, { useContext } from 'react';
import { ChevronLeftIcon } from '@primer/octicons-react';
import { useRouter } from 'next/router';
import HackathonContext from '../HackathonStore/HackathonContext';
import StoreContext from '../../../store/Store/StoreContext';
import { updateHackathonState } from '../../../services/utils/lib';
const CreateAsDraftButton = () => {
  const [hackathonState] = useContext(HackathonContext);
  const { proAccountId } = hackathonState;
  const [appState] = useContext(StoreContext);
  const setCreateHackathonResponse = (e) => {
    console.log(e);
  };

  const router = useRouter();
  const handleCreateAsDraft = async (e) => {
    e.preventDefault();
    const push = () => {
      router.push(`/pro/${proAccountId}?tab=Hackathons`);
    };
    await updateHackathonState({ ...hackathonState, isDraft: true }, appState, setCreateHackathonResponse, push);
  };
  return (
    <button
      onClick={handleCreateAsDraft}
      className=' flex content-center text-xs font-semibold items-center gap-2 py-2'
    >
      <ChevronLeftIcon />
      Save and finish later
    </button>
  );
};

export default CreateAsDraftButton;
