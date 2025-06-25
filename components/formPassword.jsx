"use client";
import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/lib/actions";
import LoadingSpinner from "@/components/LoadingSpinner";
const formPassword = ({ userInfo }) => {
  const [state, formAction, isPending] = useActionState(login, null);
  return (
    <form action={formAction}>
      <div className="w-28 h-28 rounded-full overflow-hidden mx-auto relative">
        <Image
          src={userInfo.profile_picture}
          alt="profile"
          fill
          sizes="100%"
          priority={true}
        />
      </div>
      <p className="text-center text-md text-gray-700 mt-3 dark:text-white">
        Welcome <span className="text-blue-500">{userInfo.name}</span>
      </p>
      <div className="mt-2">
        <label
          htmlFor="password"
          className="text-md font-medium text-gray-700 dark:text-white"
        >
          Password
        </label>
        <input
          autoFocus
          placeholder="Enter your password"
          type="password"
          name="password"
          id="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
        />
        {state?.Password && <p className="text-red-500">{state.Password}</p>}
        <input
          type="text"
          name="email"
          defaultValue={userInfo.email}
          required
          hidden
        />
        <input
          type="text"
          name="name"
          defaultValue={userInfo.name}
          required
          hidden
        />
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer flex items-center justify-center"
      >
        {isPending ? (
          <LoadingSpinner
            className={`size-6 text-gray-200  dark:text-gray-600 fill-white`}
          />
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default formPassword;
