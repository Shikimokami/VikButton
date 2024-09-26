"use client"

import React, { useState, useEffect } from 'react'
import Pusher from 'pusher-js'

export default function HaikuTimer({ startTime, haikuId }) {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [currentStartTime, setCurrentStartTime] = useState(startTime)

    useEffect(() => {
        if (!currentStartTime || isNaN(currentStartTime)) {
            console.error('Invalid startTime:', currentStartTime)
            return
        }

        const interval = setInterval(() => {
            const now = Date.now()
            const elapsed = Math.max(0, now - currentStartTime)
            setElapsedTime(elapsed)
        }, 1000)

        // Pusher setup
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        })

        const channel = pusher.subscribe('haiku-channel')
        channel.bind('haiku-updated', function (data) {
            if (data.haikuId === haikuId) {
                console.log('Updating timer for haiku:', haikuId)
                // Asegúrate de que startTime esté en milisegundos y en la misma zona horaria
                const newStartTime = new Date(data.startTime).getTime()
                setCurrentStartTime(newStartTime)
            }
        })

        return () => {
            clearInterval(interval)
            pusher.unsubscribe('haiku-channel')
        }
    }, [currentStartTime, haikuId])

    const formatTime = (ms) => {
        if (isNaN(ms)) {
            return 'Invalid time'
        }

        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`
    }

    return <span>{formatTime(elapsedTime)}</span>
}