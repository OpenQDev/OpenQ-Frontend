import React from 'react';
import Alert from '../../components/svg/alert';
import Cross from '../../components/svg/cross';

const LoadingBar = ({loadingBar, changeText}) => {
	return (
		<div className='flex fixed bottom-0 z-40 left-0 pl-8 p-4 bg-[#21262d] border border-gray-700 rounded-sm'>
			<div className='flex gap-2 items-center'>
				<Alert />
				<div>{ !changeText?
					'It will take a couple of minutes until your contract will be visible in our explorer'
					: 'Please reload the page to see your new contract in our explorer'
			}</div>

			</div>
			<button className='pl-4 pr-0' onClick={() => loadingBar(false)}>
				<Cross />
			</button>
		</div>
	);
};

export default LoadingBar;