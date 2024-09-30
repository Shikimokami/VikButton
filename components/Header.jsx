import Link from "next/link";
import { getUserFromCookie } from "../lib/getUser";
import { logout } from "../actions/userController";
import { Power } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  const user = await getUserFromCookie();
  return (
    <header className="bg-gray-300 shadow-xl text-gray-600 dark:bg-gray-800 dark:text-gray-400 pt-3 pb-3 flex flex-wrap max-w-screen">
      <div className="container mx-auto">
        <div className="navbar">
          <div className="flex-1 max-470:w-[90px] ">
            <Link
              href="/"
              className="btn btn-ghost text-3xl max-629:text-xl max-470:scale-75 max-470:-mr:2"
            >
              VikButton
            </Link>
          </div>
          <div className="flex flex-wrap max-470:w-[300px]">
            <ul className="menu menu-horizontal px-1 items-center">
              {user && (
                <>
                  <li className="max-470:mr-1 -max-470:ml-0 ">
                    <Link
                      href="/create-haiku"
                      className="btn btn-primary  text-xl max-629:text-sm max-629:w-28 max-470:scale-75 "
                    >
                      Create Objective
                    </Link>
                  </li>
                  <li className="max-470:mr-0 max-470:-ml-0 "></li>
                  <li className="max-470:-mr-3 max-470:ml-0 max-470:w-[75px]">
                    <form
                      action={logout}
                      className="btn max-629:w-24 max-470:scale-75"
                    >
                      <button className="text-xl max-629:text-sm max-629:w-24 ">
                        {" "}
                        <Power className="inline max-629:hidden " /> Log Out
                      </button>
                    </form>
                  </li>
                </>
              )}
              {!user && (
                <li className="">
                  <Link
                    href="/login"
                    className="btn text-xl max-629:w-24 max-470:scale-75"
                  >
                    {" "}
                    Log in
                  </Link>
                </li>
              )}
              <li className="w-[40px] ml-6">
                <ThemeToggle className="mr-0" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
