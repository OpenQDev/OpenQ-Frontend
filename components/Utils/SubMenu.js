// Thrid Party
import React from "react";

const SubMenu = ({ toggleFunc, toggleVal, names }) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row space-x-2 bg-menu-bg text-gray-400 px-4 font-semibold">
        {names.map((name, index) => {
          return (
            <button
              key={index}
              onClick={() => toggleFunc(Array.isArray(names[0]) ? name[0] : name)}
              className={`p-2 py-4 px-4 text-[0.8rem] tracking-wider ${
                toggleVal === (Array.isArray(names[0]) ? name[0] : name)
                  ? "py-3 border-b-2 border-blue-600 text-gray-200 font-bold"
                  : null
              }`}
            >
              {Array.isArray(names[0]) ? name[1] : name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default SubMenu;
