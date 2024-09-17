'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';



export default function PusherClient() {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('haiku-channel');
    channel.bind('haiku-updated', function (data) {
      console.log('Haiku updated:');

      // Here you can update your client-side state or trigger a re-fetch
    });

    return () => {
      pusher.unsubscribe('haiku-channel');
    };
  }, []);

  return null;
}