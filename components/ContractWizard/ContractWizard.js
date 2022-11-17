import React, { useEffect, useRef, useState } from 'react';
import MintBountyModal from '../MintBounty/MintBountyModal';
import ModalDefault from '../Utils/ModalDefault';
import ToolTipNew from '../Utils/ToolTipNew';
import GetSupportModal from './GetSupportModal';

const ContractWizard = ({ wizardVisibility, refreshBounties }) => {
  const [type, setType] = useState(0);
  const [mintModal, setMintModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [mintActivated, setMintActivated] = useState(false);
  // Refs
  const modal = useRef();

  // Methods
  function handleYes() {
    setMintModal(true);
    setMintActivated(true);
  }

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        wizardVisibility(false);
      }
    }
    // Bind the event listener
    {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal, mintModal, supportModal]);

  useEffect(() => {
    if (type > 3) {
      setSupportModal(true);
    }
  }, [type]);

  useEffect(() => {
    if (mintActivated && !mintModal) {
      wizardVisibility(false);
    }
  }, [mintModal]);

  const handleTypeChange = () => {
    setType(type + 1);
  };

  const resetState = () => {
    wizardVisibility(false);
  };

  const texts = new Map([
    [
      0,
      [
        'Should only one person complete this task?',
        'Deploy a Fixed Price Contract to fund a single issue to be payed out to one submitter.',
      ],
    ],
    [
      1,
      [
        'Should several people be able to earn the same amount of money for this task? This contract is especially suitable for Learn 2 Earn.',
        'Deploy a Split Price Contract, where several people can submit and claim the funds for the same issue.',
      ],
    ],
    [
      2,
      [
        'Do you want to create a contest and allow several people to earn prizes? In this case you can set different weights and choose multiple winners.',
        'Particulary suitable for Hackathons or other contests.',
      ],
    ],
    [
      3,
      [
        'Do you want to create a contest and allow several people to earn fixed prizes? In this case you can set fixed prizes and choose multiple winners.',
        'Particulary suitable for Hackathons or other contests.',
      ],
    ],
  ]);
  const text = (type) => {
    return texts.get(type) || ['Type of contract unkown.', '?'];
  };

  const btn = (
    <div className='flex text-sm rounded-sm overflow-hidden w-fit text-primary '>
      <button
        onClick={handleYes}
        className='w-fit min-w-[80px] py-[5px] px-4 rounded-l-sm border whitespace-nowrap hover:bg-secondary-button hover:border-secondary-button border-web-gray'
      >
        Yes
      </button>
      <button
        onClick={handleTypeChange}
        className='w-fit min-w-[80px] py-[5px] px-4 border-l-0 rounded-r-sm border whitespace-nowrap hover:bg-secondary-button hover:border-secondary-button border-web-gray'
      >
        No
      </button>
    </div>
  );
  return (
    <>
      {!mintModal ? (
        !supportModal ? (
          <ModalDefault
            title={'Contract Wizard'}
            footerRight={btn}
            setShowModal={wizardVisibility}
            resetState={resetState}
          >
            <h3 className='text-2xl pt-2'>
              In this section we will help you find the right type of contract for your job.
            </h3>
            <div className='flex items-center gap-2 pt-4'>
              {text(type)[0]}
              <ToolTipNew
                relativePosition={'-right-5'}
                outerStyles={'relative bottom-1'}
                innerStyles={'whitespace-normal w-60'}
                toolTipText={text(type)[1]}
              >
                <div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>
                  ?
                </div>
              </ToolTipNew>
            </div>
          </ModalDefault>
        ) : (
          <GetSupportModal wizardVisibility={wizardVisibility} modalVisibility={setSupportModal} />
        )
      ) : (
        <>
          {mintModal && (
            <MintBountyModal
              modalVisibility={setMintModal}
              types={[type.toString()]}
              hideSubmenu={true}
              refreshBounties={refreshBounties}
            />
          )}
        </>
      )}
    </>
  );
};

export default ContractWizard;
