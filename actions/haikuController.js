"use server"

import { getUserFromCookie } from "../lib/getUser"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import { pusher } from "../lib/pusher"



function isAlphaNumericWithBasics(text) {
    const regex = /^{az-A-Z0-9 .,}*$/
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


    const newStartTime = Date.now();

    const result = await haikusCollection.updateOne(
        { _id: ObjectId.createFromHexString(haikuId) },
        { $set: { startTime: newStartTime } }
    );

    // Trigger Pusher event
    await pusher.trigger('haiku-channel', 'haiku-updated', {
        haikuId: haikuId,
        startTime: newStartTime
    });

    return redirect("/");
};


export const addFriend = async function (formData) {
    const user = await getUserFromCookie()



    if (!user) {
        return redirect("/")

    }
    const usersCollection = await getCollection("users")
    const haikusCollection = await getCollection("haikus")
    let haikuId = formData.get("id")


    if (typeof haikuId != "string") haikuId = ""

    const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) })

    const friendUser = await usersCollection.findOne({ username: formData.get("friendname") })

    if (!friendUser) {
        return redirect("/")
    }

    const friendId = friendUser._id.toString()
    const authorArray = haikuInQuestion.author.toString();
    const isAuthorized = authorArray.includes(user.userId);

    // Si no existe, redirigir a la homepage
    if (!isAuthorized) {
        redirect("/")

    }
    await haikusCollection.updateOne({ _id: ObjectId.createFromHexString(haikuId) },
        { $addToSet: { author: ObjectId.createFromHexString(friendId) } })
    return redirect("/")



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
