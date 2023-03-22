import React from 'react';
import HackathonDefinition from '../../../components/Hackathon/HackathonDefinition';
import HackathonLocation from '../../../components/Hackathon/HackathonLocation';
import HackathonExtraInfo from '../../../components/Hackathon/HackathonExtraInfo';
import HackathonTime from '../../../components/Hackathon/HackathonTime';
import HackathonProvider from '../../../components/Hackathon/HackathonStore/HackathonProvider';
import CreateHackathonButton from '../../../components/Hackathon/CreateHackathonButton/index.js';
import CreateAsDraftButton from '../../../components/Hackathon/CreateAsDraftButton/index.js';
import { useRouter } from 'next/router';

const CreateHackathon = () => {
  const router = useRouter();
  console.log(router.query);
  const proAccountId = router.query.id;
  return (
    <HackathonProvider hackathon={{ proAccountId }}>
      <div className='lg:grid lg:grid-cols-extra-wide xl:grid-cols-wide justify-center md:pr-3 mx-4 sm:mx-8'>
        <div className='lg:col-start-2 justify-between justify-self-center space-y-4 w-full pb-8 max-w-[690px] mx-auto'>
          <div className=' flex-wrap gap-4 w-full items-center pt-10'>
            <CreateAsDraftButton />
            <h2 className='text-3xl my-2'>Create a new hackathon</h2>
            <p className='note my-2 pb-4'>
              A hackathon contains all possible information about your event, manages your prizes in one of our escrow
              modules whicha are paid out automatically and enables user registration and management.
            </p>
            <form className='border-y border-web-gray my-8'>
              <HackathonDefinition />

              <HackathonLocation />
              <div className='border-t border-web-gray my-8'>
                <HackathonTime />
                <HackathonExtraInfo />
              </div>
              <div className='border-web-gray border-t'>
                <CreateHackathonButton proAccountId={proAccountId} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </HackathonProvider>
  );
};

export default CreateHackathon;
