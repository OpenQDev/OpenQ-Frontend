import React from 'react';

const SubMenu = ({ updatePage, internalMenu, items, styles, colour, vertical }) => {
  return (
    <div
      className={`px-2 ${!vertical && 'sm:px-8'} text-primary  w-full flex ${
        vertical ? 'flex-col gap-2' : 'h-12 overflow-x-auto border-web-gray border-b items-center'
      }  gap-x-1 md:gap-x-4 relative ${styles} `}
    >
      {items.map((item, index) => (
        <li key={index} className='w-fit list-none  relative'>
          <button
            type='button'
            onClick={() => updatePage(item.name)}
            className={`cursor-pointerpx-1 flex gap-1 sm:gap-2 items-center text-sm hover:bg-inactive-gray leading-5 py-1 hover:bg-active-gray rounded-sm justify-center w-fit ${
              internalMenu === item.name &&
              ` ${
                vertical
                  ? 'after:h-5 after:left-0 after:w-0.5 after:absolute'
                  : 'after:w-20 after:bottom-0 after:h-0.5 after:absolute'
              } `
            }`}
          >
            {item.Svg && <item.Svg />}
            <span className='whitespace-nowrap'>{item.name}</span>
          </button>
          <div
            className={`absolute w-full  top-9 border-t ${
              internalMenu === item.name
                ? colour === 'rust'
                  ? 'border-rust '
                  : 'border-link-colour'
                : 'border-transparent'
            }`}
          ></div>
        </li>
      ))}
    </div>
  );
};

export default SubMenu;
