// Third party
import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ toggleFunc, toggleVal, names, title, styles, width }) => {

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
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref]);

	// Methods
	const handleSelection = (e) => {
		toggleFunc(e.target.value);
		updateOpen(() => !open);
	};


	const handleToggle = (e) => {
		e.preventDefault();
		updateOpen(!open);
	};

	// Render
	return (
		<details ref={ref} open={open} onClick={handleToggle} className={`max-h-8 ${styles} text-sm text-muted cursor-pointer`}>
			<summary className={`inline-flex justify-between w-${width} rounded-l-sm border-border-default text-primary rounded-l-smleading-2 py-[5px] px-4`}>{title || toggleVal}

				<svg xmlns="http://www.w3.org/2000/svg" className='fill-muted relative top-1' viewBox="0 0 16 16" width="16" height="16"><path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path></svg>
			</summary>
			<div className='w-0'>
				<ul className='z-20 relative bg-subtle w-60 mt-2 mb-4 shadow-[rgb(1,_4,_9)_0px_8px_24px_0px] border-web-gray border rounded-sm'>
					{names.length > 0 ?
						<>
							{names.map(name =>
								<li key={name}>
									<button className="w-full text-left p-2 px-4 hover:bg-dropdown-hover" onClick={handleSelection} value={name}>
										{name}
									</button>
								</li>
							)} </>
						:
						<div className="w-full text-left p-2 px-4">no label available</div>
					}
				</ul>
			</div>
		</details>);
};
export default Dropdown;