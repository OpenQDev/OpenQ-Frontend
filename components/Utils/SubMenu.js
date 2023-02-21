import React from 'react';

const SubMenu = ({ updatePage, internalMenu, items, styles, colour, vertical }) => {
  const menu = internalMenu == 'Fixed Contest' ? 'Contest' : internalMenu;
  return (
    <div
      className={`px-2 ${!vertical ? 'sm:px-8' : 'px-0'} text-primary  w-full flex ${
        vertical ? 'flex-col gap-2' : 'h-12 overflow-x-auto overflow-y-hidden border-web-gray border-b items-center'
      }  gap-x-1 md:gap-x-4 relative ${styles} `}
    >
      {items.map(
        (item, index) =>
          Object.keys(item).length > 0 && (
            <li key={index} className='w-fit list-none  relative'>
              <button
                type='button'
                onClick={() => updatePage(item.name)}
                className={`${
                  vertical && 'pl-2'
                } cursor-pointer px-1 flex gap-1 sm:gap-2 items-center text-sm hover:bg-inactive-gray leading-5 py-1 hover:bg-active-gray rounded-sm justify-center w-fit ${
                  menu === item.name &&
                  ` ${vertical && 'after:h-5 after:left-0 after:w-0.5 after:absolute after:bg-link-colour'} `
                }`}
              >
                {item.Svg && <item.Svg />}
                <span className='whitespace-nowrap'>{item.name}</span>
                {item.SecondSvg && <item.SecondSvg />}
              </button>
              {!vertical && (
                <div
                  className={`absolute w-full  top-9 border ${
                    menu === item.name
                      ? colour === 'rust'
                        ? 'border-rust bg-rust'
                        : 'border-link-colour bg-link-colour'
                      : 'border-transparent'
                  }`}
                ></div>
              )}
            </li>
          )
      )}
    </div>
  );
};

export default SubMenu;
