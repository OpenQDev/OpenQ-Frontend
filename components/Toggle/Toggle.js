// Thrid Party
import React from 'react';

const Toggle =({toggleFunc, toggleVal, names})=>{

	return(
		<div className="flex justify-center pb-12">
			<div className="flex flex-row justify-center space-x-2 border border-web-gray p-1 rounded-xl w-fit">
				<button
					onClick={()=>toggleFunc(false)}
					className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
						!toggleVal ? 'bg-gray-500' : null
					}`}
				>
					{names[0]}
				</button>
				<button
					onClick={()=>toggleFunc(true)}
					className={`text-white rounded-xl p-2 px-4 bg-opacity-20 ${
						toggleVal ? 'bg-gray-500' : null
					}`}
				>
					{names[1]}
				</button>
			</div>
		</div>);};
export default Toggle;