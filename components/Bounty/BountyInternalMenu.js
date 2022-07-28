// Thrid Party
import React from 'react';

const BountyInternalMenu =({toggleFunc, toggleVal, names})=>{
	return(
		<div className="flex text-sm rounded-sm overflow-hidden w-fit text-primary ">
				
			{names.map((name, index)=>{
				return <button key={index}
					onClick={()=>toggleFunc(name)}
					className={`w-fit min-w-[100px] py-[5px] px-4 rounded-${index ? 'r':'l'}-sm border whitespace-nowrap ${
						toggleVal===name ? 'bg-secondary-button border-secondary-button' : ' border-web-gray'
					}`}
				>
					{name}
				</button>;

			})}
		</div>);};
export default BountyInternalMenu;