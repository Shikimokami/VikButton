import Link from "next/link"
import { getUserFromCookie } from "../lib/getUser"
import { logout } from "../actions/userController"
import { Power } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default async function Header() {
  const user = await getUserFromCookie()
  return (
    <header className="bg-gray-300 shadow-xl text-gray-600 dark:bg-gray-800 dark:text-gray-400 pt-3 pb-3">
      <div className="container mx-auto">
        <div className="navbar">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-3xl">VikButton</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 items-center">
              {user && (
                <>
                  <li className="mr-3">
                    <Link href="/create-haiku" className="btn btn-primary text-xl">
                      Create Objective
                    </Link>
                  </li>
                  <li className="mr-3">
                  </li>
                  <li className="mr-3">
                    <form action={logout} className="btn">
                      <button className="text-xl"> <Power className="inline" /> Log Out</button>
                    </form>
                  </li>
                </>
              )}
              {!user && (
                <li className="mr-3">
                  <Link href="/login" className="btn text-xl"> Log in</Link>
                </li>
              )}
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}