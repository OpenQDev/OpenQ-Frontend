// Thrid Party
import React from 'react';

const Toggle =({toggleFunc, toggleVal, names})=>{

	return(
		<div className="flex justify-center">
			<div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
				<button
					onClick={()=>toggleFunc(names[0])}
					className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
						toggleVal===names[0] ? 'bg-gray-500' : null
					}`}
				>
					{names[0]}
				</button>
				<button
					onClick={()=>toggleFunc(names[1])}
					className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
						toggleVal===names[1] ? 'bg-gray-500' : null
					}`}
				>
					{names[1]}
				</button>
			</div>
		</div>);};
export default Toggle;