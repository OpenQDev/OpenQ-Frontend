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


	const handleToggle = (e)=>{
		e.preventDefault();
		updateOpen(!open);
	};

	{/*<div ref={ref} className="flex justify-center">
			<div className={`relative z-10 w-${width - 12}`}>
				<div className={`flex-col w-${width} absolute bg-dark-mode border ${borderShape} border-[#484f58] ${open ? 'rounded-r-md rounded-b-md' : 'overflow-hidden'}`}>
					{title && <h4 className={' list-none w-full relative box-content bg-[#21262d] hover:bg-[#484f58] visible h-max'}>
						<button className="w-full text-left p-2 px-4" onClick={() => updateOpen(() => !open)}>
							{title}
						</button></h4>}
					{names.map((name, index) => {
						if(name !== title){return <li className={`list-none hover:bg-active-gray w-full ${toggleVal === name ? ' visible h-max' : open ? null : 'h-0 invisible overflow-none p-0'
						}`} key={index}>
							<button className="w-full text-left p-2 px-4" onClick={handleSelection} value={name}>
								{name}
							</button>
						</li>;}
						else return null;

					})}
				</div></div>
			<button onClick={() => updateOpen(() => !open)} className=" align-self-start px-2 h-10 bg-inactive-gray w-12 rounded-lg">
				<Image className="z-10" width="20" height="40" src="/arrow-drop-down.svg" />
			</button>
		</div>*/ }
	// Render
	return (
		<details ref={ref} open={open} onClick={handleToggle} className={`max-h-8 ${styles} text-sm text-muted`}>
			<summary  className={`inline-flex justify-between w-${width} rounded-l-sm border-border-default text-primary rounded-l-smleading-2 py-[5px] px-4`}>{title||toggleVal}
			
				<svg xmlns="http://www.w3.org/2000/svg" className='fill-muted relative top-1' viewBox="0 0 16 16" width="16" height="16"><path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"></path></svg>
			</summary>
			<div className='w-0'>
				<ul className='z-50 bg-[rgb(22,_27,_34)] w-60 mt-2 mb-4 shadow-[rgb(1,_4,_9)_0px_8px_24px_0px] border-web-gray border rounded-sm'>
					{names.map(name=>
				
						<li key = {name}>
							<button className="w-full text-left p-2 px-4" onClick={handleSelection} value={name}>
								{name}
							</button>
						</li>
					)}
				</ul></div>
		</details>);
};
export default Dropdown;