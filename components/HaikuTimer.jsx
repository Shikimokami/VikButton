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
            const elapsed = now - currentStartTime

            // Aplicar un retraso de 3 segundos antes de actualizar el tiempo mostrado
            setTimeout(() => {
                setElapsedTime(elapsed)
            }, 3000) // Retraso de 3 segundos
        }, 1000)

        // Configuración de Pusher
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        })

        const channel = pusher.subscribe('haiku-channel')
        channel.bind('haiku-updated', function (data) {
            if (data.haikuId === haikuId) {
                console.log('Updating timer for haiku:', haikuId)
                setCurrentStartTime(data.startTime)
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

    return <span className='bg-blue-200 text-2xl font-semibold' >{formatTime(elapsedTime)}</span>
}
