// Thrid Party
import React from 'react';

const Toggle =({toggleFunc, toggleVal, names})=>{

	return(
		<div className="flex justify-center">
			<div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
				
				{names.map((name, index)=>{
					return <button key={index}
						onClick={()=>toggleFunc(name)}
						className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
							toggleVal===name ? 'bg-gray-500' : null
						}`}
					>
						{name}
					</button>;

				})}
			</div>
		</div>);};
export default Toggle;