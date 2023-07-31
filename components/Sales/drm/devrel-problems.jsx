import React from 'react';
import Limitations from './limitations';
import TableRow from './elements/table-row.jsx';
import CRMContextTwo from './elements/crm-context-2';

const DevRelProblems = () => {
  return (
    <div className=''>
      <div className='flex flex-col  justify-center items-center text-center  gap-8 px-8'>
        <div className='text-black font-extrabold max-w-[80rem] text-4xl lg:text-5xl'>
          Companies are investing significant resources in developer communities without gaining insights into their ROI
        </div>
        <div className='text-gray-800 text-lg lg:text-xl max-w-[50rem]'>
          Manual methods or systems aren’t fit for this purpose.
        </div>
        <div className='flex flex-col md:flex-row gap-16  md:gap-32'>
          <div className='flex flex-col text-left gap-y-4'>
            <div className='flex flex-row h-[17.2rem]'>
              <TableRow name={'Name'} cols={['lea', 'Jane', 'Alex', 'Mark', 'Anna']} type={'problem'} />
              <TableRow
                name={'Status'}
                cols={['No priority', 'No priority', 'No priority', 'No priority', 'No priority']}
                type={'problem'}
              />
              <TableRow
                name={'Status'}
                cols={['No status', 'No status', 'No status', 'No status', 'No status']}
                type={'problem'}
              />
            </div>
            <div className='text-xl font-semibold text-black'>Spreadsheet Limitations</div>
            <div className='flex flex-col space-y-3 '>
              <Limitations text='Time-consuming and labor-intensive' />
              <Limitations text='Challenging to manage effectively' />
              <Limitations text='Provides static, outdated information' />
              <Limitations text='Lacks automation for efficient workflows' />
              <Limitations text='Does not offer built-in real-time communication ' />
            </div>
          </div>
          <div className='flex flex-col text-left gap-y-8 '>
            <div>
              <CRMContextTwo />
            </div>
            <div className='text-xl font-semibold text-black max-w-[24rem]'>
              Off-the-shelf CRMs often present challenges in usability and have little use to dev rels.
            </div>
            <div className='flex flex-col space-y-3'>
              <Limitations text='Feature overload or lack of essential features' />
              <Limitations text='Lack of flexibility for customization' />
              <Limitations text='Limited integration options' />
              <Limitations text='Costly support with impersonal assistance' />
              <Limitations text='Not designed to target developers ' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevRelProblems;
