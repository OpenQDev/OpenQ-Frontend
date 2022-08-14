import React, { useEffect, useRef, useState } from 'react'
import MintBountyModal from '../MintBounty/MintBountyModal';
import ToolTipNew from '../Utils/ToolTipNew';
import GetSupportModal from './GetSupportModal';

const ContractWizard = ({ modalVisibility }) => {
	const [type, setType] = useState(0);
	const [mintModal, setMintModal] = useState(false);
	const [supportModal, setSupportModal] = useState(false);

	// Refs
	const modal = useRef();

	// Methods
	function handleNo() {
		setType(type+1);
		if(type > 2) {
			setSupportModal(true);
		};
	};

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
			{!mintModal ?
				type < 3 ?
					<div className={'flex justify-center items-start sm:items-center mx-4 overflow-x-hidden overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none p-10'}>
						<div ref={modal} className="m-auto w-3/5 min-w-[320px] z-50 fixed top-40">
							<div className="w-full rounded-sm flex flex-col bg-[#161B22] z-11 space-y-1">
								<div className='max-h-[70vh] w-full overflow-y-auto'>
									<div className="flex flex-col items-center justify-center p-5 pb-8 rounded-t">
										<h3 className="text-3xl text-center font-semibold">Contract Wizard</h3>
										<h3 className="text-2xl pt-2 w-5/6 text-center text-gray-300">
											In this section we will help you find the right type of contract for your job.
										</h3>
									</div>
									<div className="flex flex-col items-center pl-6 pr-6 pb-2">
										<div className="flex flex-col w-4/5 md:w-2/3">
											<div className='flex flex-col w-full items-start p-2 py-1 text-base bg-[#161B22]'>
												<div className='flex items-center gap-2'>
													{type == 0 ? 'Should only one person complete this task?'
														: type == 1 ? 'Should several people be able to earn the same amount of money for this task? This contract is especially suitable for Learn 2 Earn.'
															: 'Do you want to create a contest and allow several people to earn money on this task? In this case you can set different weights and choose multiple winners.'
													}
													<ToolTipNew
														innerStyles={'whitespace-normal w-60'}
														toolTipText={
															type == 0 ? 'Deploy an Atomic Contract to fund a single issue to be payed out to one submitter.'
																: type == 1 ? 'Deploy a Repeating Contract, where several people can submit and claim the funds for the same issue.'
																	: 'Do you want to create a contest and allow several people to earn money on this task? In this case you can set different weights and choose multiple winners.'

														} >
														<div className='cursor-help rounded-full border border-[#c9d1d9] aspect-square leading-4 h-4 box-content text-center font-bold text-primary'>?</div>
													</ToolTipNew>
												</div>
												<div className='flex-1 w-full mt-4 ml-4 mb-4'>
													<div className="flex text-sm rounded-sm overflow-hidden w-fit text-primary ">
														<button
															onClick={() => setMintModal(true)}
															className="w-fit min-w-[80px] py-[5px] px-4 rounded-l-sm border whitespace-nowrap hover:bg-secondary-button hover:border-secondary-button border-web-gray"
														>
															Yes
														</button>
														<button
															onClick={handleNo}
															className="w-fit min-w-[80px] py-[5px] px-4 border-l-0 rounded-r-sm border whitespace-nowrap hover:bg-secondary-button hover:border-secondary-button border-web-gray"
														>
															No
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-overlay fixed inset-0 z-10"></div>
					</div>
					:
					<GetSupportModal modalVisibility={setSupportModal}/>
				:
				<MintBountyModal modalVisibility={setMintModal} type={type == 0 ? 'Atomic' : type == 1 ? 'Repeating' : type == 2 ? 'Contest' : null} hideSubmenu={true} />}
		</>
	)
}

export default ContractWizard