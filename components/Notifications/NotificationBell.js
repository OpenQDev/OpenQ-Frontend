import React, { useRef, useState } from 'react';

import { KnockFeedProvider, NotificationIconButton, NotificationFeedPopover } from '@knocklabs/react-notification-feed';

import '@knocklabs/react-notification-feed/dist/index.css';

const notificationClicked = (item) => {
  const { bountyId, bountyAddress } = item.data;
  window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/contract/${bountyId}/${bountyAddress}`;
};

const NotificationBell = ({ userId, notificationToken }) => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  return (
    <KnockFeedProvider
      colorMode='dark'
      apiKey={process.env.NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY}
      feedId={process.env.NEXT_PUBLIC_NOTIFICATIONS_CHANNEL_ID}
      userToken={notificationToken}
      userId={userId}
    >
      <>
        <NotificationIconButton ref={notifButtonRef} onClick={() => setIsVisible(!isVisible)} />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          className='bg-red-500'
          isVisible={isVisible}
          onNotificationClick={(item) => notificationClicked(item)}
          onClose={() => setIsVisible(false)}
        />
      </>
    </KnockFeedProvider>
  );
};

export default NotificationBell;
