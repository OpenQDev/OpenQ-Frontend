// Third Party
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Dropdown =({toggleFunc, toggleVal, names})=>{
	
	// Hooks

	const [open, updateOpen]=useState(false);
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

	function handleSelection(e){
		console.log(e.target.value);
		toggleFunc(e.target.value);
		updateOpen(()=>!open);
	}

	// Render

	return(
		<div ref={ref} className="flex justify-center">
			<div className="relative w-32">
				<div className={`flex-col w-44 absolute bg-dark-mode border-b border-l border-r border-web-gray ${open ? 'rounded-b-md': 'rounded-r' }`}>
				
					{names.map((name, index)=>{
						return <li className={`text-white list-none hover:bg-gray-500 w-full hover:bg-opacity-10 ${
							toggleVal===name ? 'bg-gray-500 visible h-max bg-opacity-20' : open ? null: 'h-0 invisible overflow-none p-0'
						
						}`} key={index}>
							<button className="w-full text-left p-2 px-4" onClick={handleSelection} value={name}>
								{name}
							</button>
						</li>;

					})}
				</div></div>
			<button onClick={()=>updateOpen(()=>!open)} className="text-white align-self-start px-2 h-10 bg-gray-500 bg-opacity-20 w-12">
				<Image width="20" height="40" src="/chevron-down.svg"/>
			</button>
		</div>);};
export default Dropdown;