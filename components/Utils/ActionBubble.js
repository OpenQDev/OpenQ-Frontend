import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import useGetTokenValues from '../../hooks/useGetTokenValues';
import StoreContext from '../../store/Store/StoreContext';
import Jazzicon from './Jazzicon';


const ActionBubble = ({address, addresses, title, bodyHTML, body, action})=>{
	let currentTitle = title;
	const [tokenValues] = useGetTokenValues(action);
	const [appState] = useContext(StoreContext);
	if(action)
	{
		const metadata = appState.tokenClient.getToken(action.tokenAddress);
		const readableVolume = action.volume*(10**(-1*metadata.decimals));
		currentTitle = `${action.receiveTime ?'Funded': 'Refunded' } ${readableVolume} ${metadata.name} (${ appState.utils.formatter.format(
			tokenValues?.total)}) on ${appState.utils.formatUnixDate(action.receiveTime||action.refundTime)}.${action.receiveTime && !action.refunded ? ` Locked until ${appState.utils.formatUnixDate(parseInt(action.receiveTime)+parseInt(action.expiration))}.`: ''}`;
	}
	return (
		<div className='w-full pt-4 flex relative'>
			{action ? 
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
			<div className='w-full flex-0 rounded-sm overflow-hidden ml-4 border-web-gray border-b before:w-2 before:h-2 before:bg-nav-bg before:absolute before:absolute before:left-12 before:top-[35px] before:border-b  before:border-l before:border-web-gray before:top-10 before:rotate-45  border'>
				<div className={`bg-nav-bg w-full pl-3 ${(body || bodyHTML) && 'border-web-gray border-b'} flex justify-between`}>
					<span className='py-2'>{tokenValues || title ? currentTitle : <Skeleton width="34" />}</span>
					{action?.refunded && <span className='border rounded-full border-web-gray px-2 py-px m-1'> Refunded</span>}
				</div>
				{bodyHTML&&<div className='w-full p-4 markdown-body' dangerouslySetInnerHTML={{__html: bodyHTML }}></div>
				}
				{body&& <div>{body}</div>}
			</div>
			
		</div>);
};
export default ActionBubble;