import React, { useContext } from 'react';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from './Jazzicon';


const ActionBubble = ({address, addresses, title, bodyHTML, body, deposit})=>{
	let currentTitle = title;
	const [tokenValues] = useGetTokenValues(deposit);
	
	const [appState] = useContext(StoreContext);
	if(deposit)
	{
		const metadata = appState.tokenClient.getToken(deposit.tokenAddress);
		const readableVolume = deposit.volume*(10**(-1*metadata.decimals));
		currentTitle = `Funded ${readableVolume} ${metadata.name} (${ appState.utils.formatter.format(
			tokenValues?.total)}) on ${appState.utils.formatUnixDate(deposit.receiveTime)}.`;
	}
	return (
		<div className='w-full pt-4 flex relative'>
			{deposit ? 
				<Jazzicon styles={'w-fit'} size={36} address={address} /> :
				<div className='relative w-9'>	
					{addresses.reverse().map((address, index)=>{						
						return 	<div key={index} className={`h-4 w-10 z-${30-index*10} bg-transparent cursor-pointer relative hover:z-40`}>
							
							<div className='border-2 bg-dark-mode border-dark-mode hover:border-pink-500 rounded-lg h-10 w-10'><Jazzicon styles={'w-min'}  key={index} size={36} address={address} />
							</div>
						</div>;
					})}
				</div>
			}
			<div className='w-full flex-0 rounded-sm overflow-hidden ml-4 border-web-gray border-b  before:w-2 before:h-2 before:bg-nav-bg before:absolute before:absolute before:left-12 before:top-[35px] before:border-b  before:border-l before:border-web-gray before:top-10 before:rotate-45  border'>
				<div className={`bg-nav-bg w-full py-2 pl-3 ${(body || bodyHTML) && 'border-web-gray border-b'} `}>
					{currentTitle}
				</div>
				{bodyHTML&&<div className='w-full p-4 markdown-body' dangerouslySetInnerHTML={{__html: bodyHTML }}></div>
				}
				{body&& <div>{body}</div>}
			</div>
			
		</div>);
};
export default ActionBubble;