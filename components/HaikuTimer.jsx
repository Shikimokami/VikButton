"use client";

import React, { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";

export default function HaikuTimer({ startTime, haikuId }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(startTime);

  useEffect(() => {
    if (!startTimeRef.current || isNaN(startTimeRef.current)) {
      console.error("Invalid startTime:", startTimeRef.current);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTimeRef.current);
      setElapsedTime(elapsed);
    }, 1000);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("haiku-channel");
    channel.bind("haiku-updated", function (data) {
      if (data.haikuId === haikuId) {
        console.log("Updating timer for haiku:", haikuId);
        const newStartTime = new Date(data.startTime).getTime();
        startTimeRef.current = newStartTime;
        setElapsedTime(0); // Reset elapsed time immediately
      }
    });

    return () => {
      clearInterval(interval);
      pusher.unsubscribe("haiku-channel");
    };
  }, [haikuId]);

  const formatTime = (ms) => {
    if (isNaN(ms)) {
      return "Invalid time";
    }

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return <span>{formatTime(elapsedTime)}</span>;
}
