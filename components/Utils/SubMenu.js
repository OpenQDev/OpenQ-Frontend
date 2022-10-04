import React from 'react';

const SubMenu = ({ updatePage, internalMenu, items, styles, colour }) => {
  const handleClick = (e) => {
    updatePage(e.currentTarget.innerText);
  };
  return (
    <div
      className={`px-2 sm:px-8 text-primary border-web-gray border-b w-full flex h-12 items-center gap-x-1 md:gap-x-4 relative ${styles} overflow-x-auto`}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={handleClick}
          className={`px-1 flex gap-1 sm:gap-2 items-center text-sm hover:bg-inactive-gray leading-5 py-1 hover:bg-active-gray rounded-sm justify-center w-fit ${
            internalMenu === item.name &&
            `${
              colour === 'rust' ? 'after:bg-rust' : 'after:bg-link-colour'
            }  after:w-20 after:bottom-0 after:h-0.5 after:absolute`
          }`}
        >
          {item.Svg && <item.Svg />}
          <span className='whitespace-nowrap'>{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default SubMenu;
