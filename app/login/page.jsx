"use client";

import { useFormState } from "react-dom";
import { login } from "../../actions/userController";
import SubmitButton from "../../components/SubmitButton";

export default function Page() {
  const [formState, formAction] = useFormState(login, {});
  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 dark:text-gray-400 mb-5 mt-52">
        <strong>Log In</strong>
      </h2>
      <form
        action={formAction}
        className="max-w-xs mx-auto bg-slate-300 dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mt-6"
      >
        <div className="mb-4 w-full">
          <input
            name="username"
            autoComplete="off"
            type="text"
            placeholder="Username"
            className="w-full p-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.success == false && (
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
              <span>{formState.message}</span>
            </div>
          )}
        </div>
        <div className="mb-4 w-full">
          <input
            name="password"
            autoComplete="off"
            type="password"
            placeholder="Password"
            className="w-full p-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <SubmitButton className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </form>
    </>
  );
}
