import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const StepOne = () => {
  const [showAlternateText, setShowAlternateText] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (isSticky && !showAlternateText) {
      setShowAlternateText(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky, showAlternateText]);

  return (
    <div className={`flex flex-row bg-white text-left items-start pt-44 ${isSticky ? 'sticky' : ''}`} ref={sectionRef}>
      <div className={`pl-52 text-transition ${showAlternateText ? 'fade-in' : ''}`}>
        <div className='text-black text-4xl font-extrabold pt-3 w-[35rem]'>
          {showAlternateText
            ? 'Add GitHub repositories easily'
            : 'Add GitHub repositories, organizations and users using your technology'}
        </div>
        <div className='text-gray-800 text-lg pt-5 w-[35rem]'>
          {showAlternateText
            ? 'We get everything'
            : 'Even in the absence of pre-existing data, our target scout can scrape millions of repositories to discover projects utilizing your technology'}
        </div>
      </div>

      <div className='relative pl-64 w-full'>
        <Image
          className='w-full h-full object-cover'
          src='/landingpage/drm/devrel/devrel-landingpage-image-1.png'
          alt='Centered Image'
          width={879}
          height={693}
        />
      </div>
    </div>
  );
};

export default StepOne;
