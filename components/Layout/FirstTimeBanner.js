// Third Party
import React, { useState} from 'react';

// Custom
import useCheckFirstLaunch from '../../hooks/useCheckFirstLaunch';


const FirstTimeBanner = () => {

	const [isFirstLaunch] = useCheckFirstLaunch();
	const [showBanner, updateShowBanner] = useState(true);
	return(
		<>{showBanner && isFirstLaunch ?
			<div className="w-full bg-inactive-accent-inside border-inactive-accent border-b  grid grid-cols-[1fr_1fr_1fr] content-center py-4 items-center px-4 pr-8">

				<div className='col-start-2 col-end-3 text-center min-w-[300px]'>Welcome to <span className='font-bold text-tinted'>OpenQ!</span> Since it{'\''}s your first time with us, check out our <a className='underline font-bold text-tinted' href="https://vimeo.com/718131976" target="_blank" rel="noopener noreferrer">demo</a>.</div>
				<div className='flex justify-self-end justify-center align-center w-6 h-6 bg-inactive-accent hover:bg-active-accent rounded-md'>
					<button onClick={() => updateShowBanner(false)} className='justify-self-center relative bottom-[2px]  cursor-pointer font-bold text-center'>{'\×'}</button>
				</div>
			</div> : null}
		</>);
};

export default FirstTimeBanner;