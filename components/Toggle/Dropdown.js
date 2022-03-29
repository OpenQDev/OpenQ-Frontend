// Third Party
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Dropdown = ({ toggleFunc, toggleVal, names, title, borderShape }) => {

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

	// Render
	return (
		<div ref={ref} className="flex justify-center">
			<div className="relative w-32">
				<div className={`flex-col w-44 absolute bg-dark-mode border ${borderShape} border-web-gray ${open ? 'rounded-r-md' : 'overflow-hidden'}`}>
					{title && <h4 className={'text-white list-none w-full relative box-content bg-inactive-gray hover:bg-active-gray visible h-max'}>
						<button className="w-full text-left p-2 px-4" onClick={() => updateOpen(() => !open)}>
							{title}
						</button></h4>}
					{names.map((name, index) => {
						return <li className={`text-white list-none hover:bg-active-gray w-full ${toggleVal === name ? 'bg-inactive-gray visible h-max' : open ? null : 'h-0 invisible overflow-none p-0'

						}`} key={index}>
							<button className="w-full text-left p-2 px-4" onClick={handleSelection} value={name}>
								{name}
							</button>
						</li>;

					})}
				</div></div>
			<button onClick={() => updateOpen(() => !open)} className="text-white align-self-start px-2 h-10 bg-inactive-gray w-12 rounded-lg">
				<Image width="20" height="40" src="/chevron-down.svg" />
			</button>
		</div>);
};
export default Dropdown;