import React, { useEffect, useRef } from 'react'

const ContractWizard = ({ modalVisibility }) => {

	const closeModal = () => {
		modalVisibility(false);
	};

	// Refs
	const modal = useRef();

	useEffect(() => {
		// Courtesy of https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
		function handleClickOutside(event) {
			if (modal.current && !modal.current.contains(event.target)) {
				modalVisibility(false);
			}
		}
		// Bind the event listener
		{
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [modal]);


	return (
		<>
			<div className={'flex justify-center items-start sm:items-center mx-4 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-10'}>
				<div ref={modal} className="m-auto w-3/5 min-w-[320px] z-50 fixed top-24">
					<div className='max-h-[70vh] w-full overflow-y-auto'>
						<div className="w-full rounded-sm flex flex-col bg-[#161B22] z-11 space-y-1">
							<div className="flex flex-col items-center justify-center p-5 pb-3 rounded-t">
								<h3 className="text-3xl text-center font-semibold">Contract Wizard</h3>
								<h3 className="text-2xl pt-2 w-5/6 text-center text-gray-300">
									In this section we will help you find the right type of contract for your job.

								</h3>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-overlay fixed inset-0 z-10"></div>
			</div>
		</>
	)
}

export default ContractWizard