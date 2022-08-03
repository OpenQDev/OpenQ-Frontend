import React from 'react';

const SubMenu = ({updatePage, internalMenu, items, styles, colour })=>{


	const handleClick = (e)=>{
		updatePage(e.currentTarget.innerText);

	};
	return (
	
	
		<div className={`px-4 sm:px-8 text-primary border-web-gray border-b w-full flex h-12 items-center gap-x-2 md:gap-x-4 relative ${styles}`}>
			{items.map((item, index)=><button key={index} onClick={handleClick} className={`px-2 flex gap-2 items-center text-sm hover:bg-inactive-gray leading-5 px-3 py-1 hover:bg-active-gray rounded-sm justify-center w-fit ${internalMenu === item.name && `${colour==='rust'? 'after:border-rust':'after:border-link-colour' } after:border-2 after:-bottom-[1px] after:w-20 after:absolute after:border-b`}`}>
				{item.Svg && <item.Svg/>}
				<span>{item.name}</span>
			</button>)}
			
		</div>
	);
};

export default SubMenu;