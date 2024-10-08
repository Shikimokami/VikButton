"use client";
import { createHaiku } from "../actions/haikuController";
import { useFormState } from "react-dom";
import SubmitButton from "./SubmitButton";

export default function HaikuForm() {
  const [formState, formAction] = useFormState(createHaiku, {});

  return (
    <form
      action={formAction}
      className="max-w-xs mx-auto bg-slate-300 p-6 rounded-lg shadow-lg flex flex-col items-center dark:bg-gray-800 mt-6"
    >
      <div className="mb-4 w-full">
        <input
          name="objectivename"
          autoComplete="off"
          type="text"
          placeholder=""
          className="w-full p-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formState.errors?.objectivename && (
          <div role="alert" className="mt-2 text-red-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{formState.errors?.objectivename}</span>
          </div>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
