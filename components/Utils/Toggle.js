// Thrid Party
import React from 'react';

const Toggle =({toggleFunc, toggleVal, names})=>{

	return(
		<div className="flex justify-center">
			<div className="flex flex-row justify-center space-x-2 rounded-sm border border-border-gray bg-menu-bg p-1 w-fit">
				
				{names.map((name, index)=>{
					return <button key={index}
						onClick={()=>toggleFunc(name)}
						className={`rounded-sm p-2 px-8 hover:bg-[#161B22]  ${
							toggleVal===name ? 'bg-[#21262d]' : null
						}`}
					>
						{name}
					</button>;

				})}
			</div>
		</div>);};
export default Toggle;