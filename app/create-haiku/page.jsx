import { getUserFromCookie } from "../../lib/getUser";
import { redirect } from "next/navigation";
import HaikuForm from "../../components/HaikuForm";

export default async function Page() {
  const user = await getUserFromCookie();

  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 dark:text-gray-400 mb-5 mt-52 ">
        <strong>Create Timer</strong>
      </h2>
      <HaikuForm />
    </>
  );
}
