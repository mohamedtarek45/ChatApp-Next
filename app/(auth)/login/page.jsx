"use client"
import Link from "next/link";
import { useActionState } from "react";
import { checkMail } from "@/lib/actions";
import LoadingSpinner from "@/components/LoadingSpinner";
const page = () => {
  const [state, formAction, isPending] = useActionState(checkMail, null);

  return (
    <div className=" mt-20 sm:mt-5  w-full px-4">
      <div className="shadow-sm rounded-md w-full max-w-md p-4 bg-slate-200 dark:bg-ExtraDark mx-auto dark:border-1 dark:border-gray-800">
        <h3 className="text-center dark:text-white">Welcome to Chat App</h3>
        <form action={formAction}>
          <div className="mt-7">
            <label
              htmlFor="email"
              className="text-md font-medium text-gray-700 dark:text-white"
            >
              Email
            </label>
            <input
              placeholder="Enter your Email"
              type="email"
              name="email"
              id="email"
              autoFocus
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
            />
            {state?.Email && <p className="text-red-500">{state.Email}</p>}
          </div>

          <button disabled={isPending} className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer flex items-center justify-center">
            {isPending ? (<LoadingSpinner className={`size-6 text-gray-200  dark:text-gray-600 fill-white`}/>):" Login"}
          </button>
        </form>
        <p className="text-center text-sm mt-2 text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
