// Third party
import React from 'react';
import TokenList from './TokenList';
import ManageTokenList from '../ManageTokenList';
import { useState } from 'react';

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
				className='justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 left-20 z-50 outline-none focus:outline-none'
			>
				<div className='w-5/6 max-w-md'>
					{' '}
					<div
						onClick={e => e.stopPropagation()}
						className='flex justify-left border border-web-gray pl-8 pr-8 pt-5 pb-3 rounded-lg shadow-lg flex flex-col w-full bg-dark-mode outline-none focus:outline-none'
					>
						{showListManager ? (
							<div className='h-[30rem]'>
								<div className='flex items-center justify-between border-solid rounded-t pt-2 pb-4'>
									<h3 className='text-1xl font-semibold'>Select a Token</h3>
									<button
										className='text-3xl hover:text-tinted'
										onClick={() => setShowTokenSearch(false)}
									>
                    ×
									</button>
								</div>

								<div className='pt-3 pb-3 pl-4 bg-dark-mode border border-web-gray rounded-lg overflow-hidden mb-2'>
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
								<div className='pt-4 overflow-auto h-72'>
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
								<div className='flex flex-col justify-items-center gap-2 justify-end p-6 border-t border-solid rounded-b'></div>
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
							className='confirm-btn'
							onClick={e => {
								setShowListManager(() => !showListManager);
								e.stopPropagation();
							}}
						>
							{showListManager ? 'Manage token lists' : 'Back'}
						</button>
					</div>
				</div>
			</div>
			<div className='fixed inset-0 bg-overlay'></div>
		</div>
	);
};

export default TokenSearch;
