import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import HaikuTimer from "./HaikuTimer"
import { addFriend, deleteHaiku, updateHaikuTime } from "../actions/haikuController"
import { PlusCircle, Trash2 } from "lucide-react"

async function getHaikus(id) {
    const collection = await getCollection("haikus")
    const results = await collection.find({ author: ObjectId.createFromHexString(id) }).sort({ startTime: -1 }).toArray()
    return results
}

export default async function Dashboard(props) {
    const haikus = await getHaikus(props.user.userId)

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 flex flex-col items-center dark:bg-gray-900">
            <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 mb-14">Your Timers</h2>

            <div className="flex flex-wrap justify-center gap-6 min-h max-w-screen mx-auto">
                {haikus.map((haiku, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-8 flex flex-col justify-between w-[50vw] max-470:min-w-[350px] min-h-[700px] max-470:scale-95 max-470:max-w-[400px]">
                        <div className="mb-6">
                            <p className="mt-4 text-4xl font-bold mb-4 text-center dark:text-gray-200">{haiku.objectivename.toUpperCase()}</p>
                        </div>
                        <div className="flex-1 flex justify-center items-center text-gray-600 dark:text-gray-400 p-4">
                            <form action={updateHaikuTime} className="flex-shrink-0">
                                <input name="id" type="hidden" defaultValue={haiku._id.toString()} />
                                <button className="bg-green-400 text-white font-semibold p-6 rounded-xl text-4xl transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg transform hover:scale-105 dark:bg-green-600 dark:hover:bg-red-700">
                                    <HaikuTimer startTime={haiku.startTime} haikuId={haiku._id.toString()} />
                                </button>
                            </form>
                        </div>

                        <div className="flex justify-between mt-6 flex-wrap">
                            <form action={addFriend} className="flex-shrink-0 max-w-full">
                                <input type="text" autoComplete="off" className="max-1010:w-[130px] text-stone-900 bg-slate-300 dark:bg-slate-600 dark:text-white p-2 mr-2 border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 " name="friendname" placeholder="Friend's username" />
                                <input name="id" type="hidden" defaultValue={haiku._id.toString()} />
                                <button className="inline btn-xl max-1010:btn-md bg-blue-500 text-white p-4 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800">
                                    <PlusCircle className="h-4 w-4 mr-2 inline" />
                                    Add friend
                                </button>
                            </form>
                            <form action={deleteHaiku} className="flex-shrink-0  max-470:w-[100%]">
                                <input name="id" type="hidden" defaultValue={haiku._id.toString()} />
                                <button className="max-470:mt-6 max-470:w-[100%] btn-xl max-1010:btn-md bg-red-500 text-white p-4 rounded hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 inline">
                                    <Trash2 className="h-4 w-4 mr-2 inline" />
                                    Delete
                                </button>
                                
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {haikus.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-8">You haven't created any timer yet. Start creating!</p>
            )}
        </div>
    );
}