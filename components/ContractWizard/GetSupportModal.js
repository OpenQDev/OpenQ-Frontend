import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import ModalDefault from '../Utils/ModalDefault';

const GetSupportModal = ({ wizardVisibility, modalVisibility }) => {
  // Refs
  const modal = useRef();

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (modal.current && !modal.current.contains(event.target)) {
        modalVisibility(false);
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
  }, [modal]);

  const resetState = () => {
    modalVisibility(false);
  };

  const btn = (
    <Link
      href={'https://discord.gg/puQVqEvVXn'}
      className='flex items-center gap-2 btn-primary'
      target={'_blank'}
      rel='noopener noreferrer'
    >
      <Image src={'/social-icons/discord.svg'} width={24} height={24} />
      <p>Get Help!</p>
    </Link>
  );

  return (
    <>
      <ModalDefault
        title={"We didn't find a suitable contract"}
        footerRight={btn}
        setShowModal={wizardVisibility}
        resetState={resetState}
      >
        <h3 className='text-lg pt-4'>
          Don't worry, you can help us and describe more precisely what kind of contract you want. If we don't have this
          one yet, we'll be happy to get to it next.
        </h3>
        <p className='pt-4 pr-4'>
          Join our Discord and write us in the support channel or send us an email at riccardo@openq.dev
        </p>
      </ModalDefault>
    </>
  );
};

export default GetSupportModal;
