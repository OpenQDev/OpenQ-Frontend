// Thrid Party
import React from "react";
import ProfilePicture from "../Layout/ProfilePicture";

const SubMenu = ({ toggleFunc, toggleVal, names, contributor }) => {
  return (
		<>
    <div className={`${contributor ? 'px-4 sm:px-8 text-primary w-full flex h-12 items-center gap-x-4 relative' : 'flex justify-center'}`}>
		
		
		<div className={`${contributor ? '' : 'flex flex-row space-x-2 bg-menu-bg text-gray-400 px-4 font-semibold'}`}>
			
        {names.map((name, index) => {
          return (
            <button
              key={index}
              onClick={() => toggleFunc(contributor ? name[0] : name)}
              className={`p-2 py-4 px-4 text-[0.8rem] tracking-wider ${
                toggleVal === (contributor ? name[0] : name)
                  ? (contributor ?
										" py-3 border-b-4 border-rust text-gray-200 font-bold"
										: "py-3 border-b-2 border-blue-600 text-gray-200 font-bold"
									)
                  : null
              }`}
            >
              {contributor ? name[1] : name}
            </button>
          );
        })}
      </div>
    </div>
		</>
  );
};
export default SubMenu;

