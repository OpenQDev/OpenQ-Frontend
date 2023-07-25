import React from 'react';
import Limitations from './limitations';
import TableRow from './elements/table-row.jsx';
import CRMContextTwo from './elements/crm-context-2';

const DevRelProblems = () => {
  return (
    <div>
      <div className='flex flex-col bg-white justify-center items-center text-center pt-10 px-2'>
        <div className='text-black text-4xl font-extrabold pt-3 max-w-[59rem]'>
          Companies are investing significant resources in developer communities without gaining insights into their ROI
        </div>
        <div className='text-gray-800 text-lg pt-5 max-w-[29rem]'>
          Manual methods or systems aren’t fit for this purpose.
        </div>
        <div className='flex flex-col md:flex-row  gap-32 pt-12'>
          <div className='flex flex-col text-left space-y-10'>
            <div className='flex flex-row h-[18.4rem]'>
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
            <div className='flex flex-col space-y-3 pt-7'>
              <Limitations text='Time-consuming and labor-intensive' />
              <Limitations text='Challenging to manage effectively' />
              <Limitations text='Provides static, outdated information' />
              <Limitations text='Lacks automation for efficient workflows' />
              <Limitations text='Does not offer built-in real-time communication ' />
            </div>
          </div>
          <div className='flex flex-col text-left space-y-10'>
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
