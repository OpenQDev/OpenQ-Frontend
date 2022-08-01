// Thrid Party
import React from 'react';

const SubMenu = ({ toggleFunc, styles, toggleVal, names, borderColour, contributor }) => {
	return (
		<>
			<div className={`${contributor ? 'px-4 sm:px-8 text-primary w-full flex h-12 items-center gap-x-4 relative' : `flex ${styles}`}`}>
		
				<div className={`${contributor ? '' : 'flex flex-row space-x-2 bg-menu-bg text-gray-400 px-4 font-semibold'}`}>
			
					{names.map((name, index) => {
						return (
							<button
								key={index}
								onClick={() => toggleFunc(contributor ? name[0] : name)}
								className={`p-2 px-4 text-[0.8rem] tracking-wider ${
									toggleVal === (contributor ? name[0] : name)
										? (contributor ?
											' border-b-4 border-rust text-gray-200 font-bold'
											: `py-3 border-b-2 ${borderColour ? borderColour :'border-blue-600'   } text-gray-200 font-bold`
										)
										: null
								}`}
							>
								{contributor ? <div className=" hover:bg-active-gray rounded-sm">{name[1]}</div> : name}
							</button>
						);
					})}
				</div>
			</div>
		</>
	);
};
export default SubMenu;

