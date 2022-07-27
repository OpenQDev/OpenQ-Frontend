// Third party
import React from 'react';
import TokenList from './TokenList';
import ManageTokenList from '../ManageTokenList';
import { useState } from 'react';
import { XIcon } from '@primer/octicons-react';

const TokenSearch = ({ setShowTokenSearch, onCurrencySelect, polygonTokens, openQTokens, currentCursor }) => {
	const [showListManager, setShowListManager] = useState(true);
	const [tokenSearchTerm, setTokenSearchTerm] = useState();
	const [lists, setLists] = useState({ polygon: true, openq: true });
	const [customTokens, setCustomTokens] = useState([]);
	function handleOutsideClick () {
		setShowTokenSearch(false);
	}

	return (
		<div>
			<div
				onClick={handleOutsideClick}
				className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 left-20 z-50 outline-none focus:outline-none'
			>
				<div className='w-5/6 max-w-md'>
					{' '}
					<div
						onClick={e => e.stopPropagation()}
						className='flex justify-left border border-border-gray pl-8 pr-8 pt-5 pb-3 rounded-sm shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none'
					>
						{showListManager ? (
							<div className='h-[30rem]'>
								<div className='flex flex-row items-center justify-between rounded-t pt-2 pb-4'>
									<h3 className='flex text-1xl font-semibold'>Select a Token</h3>
									<button
										className='flex text-3xl hover:text-tinted'
										onClick={() => setShowTokenSearch(false)}
									><XIcon size={16} />
									</button>
								</div>

								<div className='pt-3 pb-3 pl-4 input-field-big overflow-hidden mb-2'>
									<div className=''>
										<div className='justify-start '>
											<input
												className='outline-none bg-transparent '
												onKeyUp={e => setTokenSearchTerm(e.target.value)}
												type='text'
												placeholder='Search name'
											></input>
										</div>
									</div>
								</div>
								<div className='mt-8 overflow-auto h-72'>
									{polygonTokens && openQTokens && (
										<TokenList
											customTokens={customTokens}
											currentCursor={currentCursor}
											lists={lists}
											polygonDefaultTokens = {polygonTokens}
											openqDefaultTokens = {openQTokens}
											tokenSearchTerm={tokenSearchTerm}
											onCurrencySelect={onCurrencySelect}
											setShowTokenSearch={setShowTokenSearch}
										/>
									)}
								</div>
								<div className='flex flex-col justify-items-center  justify-end border-t border-gray-700 '></div>
							</div>
						) : (
							<ManageTokenList
								setLists={setLists}
								setCustomTokens={setCustomTokens}
								customTokens={customTokens}
								lists={lists}
							/>
						)}
						<button
							className='btn-default p-2 m-2'
							onClick={e => {
								setShowListManager(() => !showListManager);
								e.stopPropagation();
							}}
						>
							{showListManager ? 'Manage Token Lists' : 'Back'}
						</button>
					</div>
				</div>
			</div>
			<div className='fixed inset-0 bg-overlay'></div>
		</div>
	);
};

export default TokenSearch;
