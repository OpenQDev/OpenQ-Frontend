// Third party
import React, { useState, useEffect, useRef } from 'react';
import Exit from '../svg/exit';
import Check from '../svg/check';

const Dropdown = ({ toggleFunc, toggleVal, names, title, styles, width, dropdownWidth, removeFunc }) => {
  // Hooks
  const [open, updateOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    // Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        updateOpen(false);
      }
    }

    // Bind the event listener
    if (ref.current) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  // Methods
  const addSelection = (e, name) => {
    if (!toggleVal.includes(name)) toggleFunc(name);
    e.stopPropagation();
  };
  const removeSelection = (e, name) => {
    e.stopPropagation();
    removeFunc(name);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    if (e.target.open) {
      updateOpen(true);
    }
  };

  // Render
  return (
    <details
      ref={ref}
      onToggle={handleToggle}
      open={open}
      className={`h-7 ${styles} text-sm text-muted cursor-pointer`}
    >
      <summary
        className={`inline-flex justify-between ${width} rounded-l-sm border-border-default text-primary rounded-l-smleading-2 py-[5px] px-4`}
      >
        {title || toggleVal}

        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='fill-muted relative top-1'
          viewBox='0 0 16 16'
          width='16'
          height='16'
        >
          <path d='M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z'></path>
        </svg>
      </summary>
      <div className='w-0'>
        <ul
          className={`z-20 relative bg-subtle ${dropdownWidth} max-h-60 overflow-y-auto mt-2 mb-4 shadow-[rgb(1,_4,_9)_0px_8px_24px_0px] border-web-gray border rounded-sm`}
        >
          {names.length > 0 ? (
            <>
              {names.map((name) => (
                <li className='relative w-full hover:bg-dropdown-hover' key={name}>
                  <button
                    className={` text-left p-2 ${(!removeFunc || !toggleVal.includes(name)) && 'w-full'}`}
                    onClick={(e) => addSelection(e, name)}
                    value={name}
                  >
                    {toggleVal.includes(name) ? (
                      <Check className='inline mr-2  fill-muted' />
                    ) : (
                      <div className='inline-block w-6'></div>
                    )}
                    {name}
                  </button>
                  {toggleVal.includes(name) && removeFunc && (
                    <button onClick={(e) => removeSelection(e, name)}>
                      <Exit className='inline mr-2 fill-muted  absolute right-0 top-3' />
                    </button>
                  )}
                </li>
              ))}{' '}
            </>
          ) : (
            <div className='w-full text-left p-2 px-4'>no label available</div>
          )}
        </ul>
      </div>
    </details>
  );
};
export default Dropdown;
