import React, {useEffect, useRef} from 'react'

const ContractWizard = ({modalVisibility}) => {

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
					<div className="w-full rounded-sm flex flex-col bg-[#161B22] z-11 space-y-1">
						ContractWizard
					</div>
				</div>
				<div className="bg-overlay fixed inset-0 z-10"></div>
			</div>
		</>
	)
}

export default ContractWizard