"use client"


import React, { useEffect } from "react"
import {useFormStatus} from "react-dom"

export default function SubmitButton() {
    const { pending } = useFormStatus()


    useEffect(() => {
        console.log(pending)
    }, [pending])

    return (
        <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={pending}>
            Submit {pending && '....'}
        </button>
    )



    

}
