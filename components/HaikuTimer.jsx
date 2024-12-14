"use client";

import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";

export default function HaikuTimer({ startTime, haikuId }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTimeState, setStartTimeState] = useState(startTime);

  useEffect(() => {
    if (!startTimeState || isNaN(startTimeState)) {
      console.error("Invalid startTime:", startTimeState);
      return;
    }

    let interval = setInterval(updateElapsedTime, 1000);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("haiku-channel");

    const handleUpdate = (data) => {
      if (data.haikuId === haikuId) {
        console.log("Updating timer for haiku:", haikuId);
        setStartTimeState(new Date(data.startTime).getTime());
        setElapsedTime(0); // Reset elapsed time
      }
    };

    channel.bind("haiku-updated", handleUpdate);

    function updateElapsedTime() {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTimeState);
      setElapsedTime(elapsed);
    }

    return () => {
      clearInterval(interval);
      channel.unbind("haiku-updated", handleUpdate);
      pusher.unsubscribe("haiku-channel");
    };
  }, [haikuId, startTimeState]);

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
