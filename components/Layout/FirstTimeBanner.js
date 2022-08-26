// Third Party
import React, { useState } from 'react';
import Cross from '../../components/svg/cross'

// Custom
import useCheckFirstLaunch from '../../hooks/useCheckFirstLaunch';


const FirstTimeBanner = () => {

	const [isFirstLaunch] = useCheckFirstLaunch();
	const [showBanner, updateShowBanner] = useState(true);
	return (
		<>{showBanner && isFirstLaunch ?
			<div className="w-full bg-[#21262d] border-gray-700 border-b grid grid-cols-[1fr_1fr_1fr_1fr] py-4 items-center px-4">

				<div className='col-start-2 col-end-4 text-center text-sm min-w-[240px]'>Welcome to <span className='font-bold'>OpenQ!</span> Since it{'\''}s your first time with us, check out our <a className='text-blue-400 hover:underline' href="https://vimeo.com/718131976" target="_blank" rel="noopener noreferrer">demo</a>.</div>
				<div className='flex justify-self-end'>
					<button onClick={() => updateShowBanner(false)} className='px-4' >
						<Cross />
					</button>
				</div>
			</div> : null}
		</>);
};

export default FirstTimeBanner;