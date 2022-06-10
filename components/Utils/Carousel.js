// Third party 
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';


const Carousel = ({styles, children}) => {
	const scroller = useRef();
	const [isScrollable, setIsScrollable] = useState();
	const [isScrolling, setIsScrolling] = useState();

	// Thanks to https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
	useLayoutEffect(() => {
		function updateScrollable() {
			setIsScrollable(scroller.current?.scrollLeftMax>0);
		}
		window.addEventListener('resize', updateScrollable);
		updateScrollable();
		return () => window.removeEventListener('resize', updateScrollable);
	}, []);

	useEffect(()=>{
		let incrementer;
		if(isScrolling){
			const scrollVector = isScrolling==='right' ? 10 :-10;
			incrementer = setInterval(()=>{
				const currentScroll	=scroller.current.scrollLeft;
				scroller.current.scroll({left: scrollVector+currentScroll, behaviour: 'smooth'});
			},.25);}
		return ()=> {if(isScrolling){clearInterval(incrementer);}};
	},[isScrolling]);
	
	// render
	return (
		<div onMouseUp={()=>setIsScrolling()} className={`relative ${isScrollable && 'lg:-left-10 lg:-right-10  lg:w-[calc(100%+80px)]'} justify-center self-center w-full flex ${styles}`}>
			{isScrollable &&	<button className='sr-only lg:not-sr-only' data-testid="scroll carousel left" onMouseDown={()=>setIsScrolling('left')}>	
				<svg className='hover:fill-web-gray fill-dark-mode stroke-web-gray active:stroke-pink-500' width="44" height="36" viewBox="0 0 44 66" xmlns="http://www.w3.org/2000/svg">
					<path d="M36.0583 63.6563L3.17933 35.4362C1.29394 33.8179 1.32452 30.8904 3.24329 29.3119L36.0513 2.32171C39.4475 -0.472269 44.2094 3.46345 42.1048 7.32496L29.9165 29.688C28.9554 31.4514 28.9403 33.5786 29.8762 35.3555L42.2025 58.7569C44.259 62.6611 39.4068 66.5303 36.0583 63.6563Z" strokeWidth="2"/>
				</svg>

			</button>}
			<div ref={scroller} data-testid="carousel" className='flex gap-2 lg:max-w-[100%] lg:w-[950px] overflow-x-auto pt-4 pb-4 px justify-items-center'>
				{	isScrollable && <div className='pointer-events-none absolute bg-gradient-to-r from-dark-mode to-black/0 w-12 sm:w-52 h-32 left-0 lg:left-10'></div>}
				{children}
				{	isScrollable && <div className='absolute pointer-events-none bg-gradient-to-l from-dark-mode to-black/0 w-12 sm:w-52 h-32 right-0 lg:right-10'></div>}
			</div>
			{isScrollable&& <button className='sr-only lg:not-sr-only' data-testid="scroll carousel right" onMouseDown={()=>setIsScrolling('right')} >
				<svg className='hover:fill-web-gray fill-dark-mode stroke-web-gray active:stroke-pink-500'  width="44" height="36" viewBox="0 0 44 66" xmlns="http://www.w3.org/2000/svg">
					<path d="M8.56771 63.6563L41.4466 35.4362C43.332 33.8179 43.3015 30.8904 41.3827 29.3119L8.57468 2.32171C5.17844 -0.472269 0.416603 3.46345 2.5212 7.32496L14.7095 29.688C15.6706 31.4514 15.6857 33.5786 14.7497 35.3555L2.42346 58.7569C0.366937 62.6611 5.21921 66.5303 8.56771 63.6563Z" strokeWidth="2"/>
				</svg>
			</button>}
		</div>
	);
};

export default Carousel;