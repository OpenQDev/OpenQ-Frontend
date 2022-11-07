import React, { useRef, useEffect, useContext } from 'react';
import jazzicon from '@metamask/jazzicon';
import CopyAddressToClipboard from '../Copy/CopyAddressToClipboard';
import StoreContext from '../../store/Store/StoreContext';
import Image from 'next/legacy/image';

const Stream = ({ stream, direction }) => {
  const [appState] = useContext(StoreContext);
  const iconWrapper = useRef();
  const otherAccount = stream?.receiver || stream?.sender;
  const readableTime = appState.utils.formatDate(parseInt(stream.createdAtTimestamp) * 1000);
  const token = appState.tokenClient.getToken(stream.token.id);
  const { name, path } = token;
  useEffect(() => {
    if (otherAccount?.id && iconWrapper.current) {
      iconWrapper.current.innerHTML = '';
      iconWrapper.current.appendChild(jazzicon(32, parseInt(otherAccount?.id?.slice(2, 10), 16)));
    }
  }, [stream?.receiver?.id]);
  return (
    <div className='p-4 w-fit border border-web-gray rounded-sm'>
      <div className='flex gap-8 space-between w-full'>
        <div className='flex gap-2'>
          <Image height={32} width={32} src={path} />
          <div className='pt-2'>{name}</div>
        </div>
        <span className='pt-2'>{direction === 'in' ? 'From' : 'To'}</span>
        <div className='flex gap-2'>
          <div className='pt-1' ref={iconWrapper}></div>
          <CopyAddressToClipboard data={otherAccount.id} clipping={[5, 38]} />
        </div>
      </div>
      <div>
        Flow Rate: {parseInt(stream.currentFlowRate) * 10 ** (-1 * stream.token.decimals) * 24 * 60 * 60}
        /day
      </div>
      <div>Total deposit: {parseInt(stream.deposit) * 10 ** (-1 * stream.token.decimals)}</div>
      <div>Created on {readableTime}.</div>
    </div>
  );
};
export default Stream;
