"use server"

import { getUserFromCookie } from "../lib/getUser"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import { pusher } from "../lib/pusher"



function isAlphaNumericWithBasics(text) {
    const regex = /^[a-zA-Z0-9 .,]*$/
    return regex.test(text)
}


async function sharedHaikuLogic(formData, user) {
    const errors = {}

    const ourHaiku = {
        objectivename: formData.get("objectivename"),
        author: [ObjectId.createFromHexString(user.userId)],
        startTime: Date.now()
    }

    if (typeof ourHaiku.objectivename != "string") ourHaiku.objectivename = ""


    ourHaiku.objectivename = ourHaiku.objectivename.replace(/(\r\n|\n|\r)/g, " ")


    ourHaiku.objectivename = ourHaiku.objectivename.trim()


    if (ourHaiku.objectivename.length < 1) errors.objectivename = "Too short."
    if (ourHaiku.objectivename.length > 25) errors.objectivename = "Too long."

    if (isAlphaNumericWithBasics(ourHaiku.objectivename)) errors.objectivename = "No special characters allowed."


    if (ourHaiku.objectivename === 0) errors.objectivename = "This field is required"



    return {
        errors,
        ourHaiku
    }


}

export const createHaiku = async function (prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.objectivename) {
        return { errors: results.errors }
    }

    const haikusCollection = await getCollection("haikus")
    const newHaiku = await haikusCollection.insertOne(results.ourHaiku)
    return redirect("/")
}

export const updateHaikuTime = async function (formData) {
    const user = await getUserFromCookie();

    if (!user) {
        return redirect("/");
    }

    const haikusCollection = await getCollection("haikus");
    let haikuId = formData.get("id");
    if (typeof haikuId != "string") haikuId = "";

    const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) });
    const authorArray = haikuInQuestion.author.toString();
    const isAuthorized = authorArray.includes(user.userId);

    // Si no está autorizado, redirigir a la página principal
    if (!isAuthorized) {
        return redirect("/");
    }

    const result = await haikusCollection.updateOne(
        { _id: ObjectId.createFromHexString(haikuId) },
        { $set: { startTime: Date.now() } }
    );

    // Trigger Pusher event
    await pusher.trigger('haiku-channel', 'haiku-updated', {
        haikuId: haikuId,
        startTime: Date.now()
    });

    return redirect("/");
};


export const addFriend = async function (formData) {
    const user = await getUserFromCookie()
    if (!user) {
        return { error: "User not authenticated" }
    }

    const usersCollection = await getCollection("users")
    const haikusCollection = await getCollection("haikus")
    const haikuId = formData.get("id")
    const friendUsername = formData.get("friendname")

    if (!haikuId || typeof haikuId !== "string") {
        return { error: "Invalid haiku ID" }
    }

    if (!friendUsername || typeof friendUsername !== "string") {
        return { error: "Invalid friend username" }
    }

    try {
        const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) })
        if (!haikuInQuestion) {
            return { error: "Haiku not found" }
        }

        const isAuthorized = haikuInQuestion.author.some(authorId => authorId.toString() === user.userId)
        if (!isAuthorized) {
            return { error: "Not authorized to modify this haiku" }
        }

        const friendUser = await usersCollection.findOne({ username: friendUsername })
        if (!friendUser) {
            return { error: "Friend not found" }
        }

        const friendId = friendUser._id
        if (haikuInQuestion.author.some(authorId => authorId.equals(friendId))) {
            return { error: "User is already an author of this haiku" }
        }

        await haikusCollection.updateOne(
            { _id: ObjectId.createFromHexString(haikuId) },
            { $addToSet: { author: friendId } }
        )

        return { success: "Friend added successfully" }
    } catch (error) {
        console.error("Error in addFriend:", error)
        return { error: "An unexpected error occurred" }
    }
}
export const deleteHaiku = async function (formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect("/")
    }

    const haikusCollection = await getCollection("haikus")
    let haikuId = formData.get("id")
    if (typeof haikuId != "string") haikuId = ""

    const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) })
    const authorArray = haikuInQuestion.author.toString();
    const isAuthorized = authorArray.includes(user.userId);

    // Si no existe, redirigir a la homepage
    if (!isAuthorized) {
        redirect("/")

    }
    await haikusCollection.deleteOne({ _id: ObjectId.createFromHexString(haikuId) })
    return redirect("/")

}

