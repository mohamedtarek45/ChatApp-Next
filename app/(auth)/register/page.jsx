"use client";

import { useState, useActionState } from "react";
import { register } from "@/lib/actions";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
const page = () => {
  const [state, formAction, isPending] = useActionState(register, null);
  const [profileState, setProfileState] = useState(null);
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("File size should be less than 1.5MB");
      e.target.value = "";
    } else {
      setProfileState(file.name);
    }
  };

  return (
    <div className="mt-20 sm:mt-5 w-full px-3">
      <Toaster />
      <div className="shadow-sm rounded-md w-full max-w-md p-4 bg-slate-200 dark:bg-ExtraDark mx-auto dark:border-1 dark:border-gray-800">
        <h3 className="text-center">Welcome to Chat App</h3>
        <form action={formAction} >
          <div className="mt-7">
            <label htmlFor="name" className="text-md font-medium text-gray-700 dark:text-white">
              Name
            </label>
            <input
              placeholder="Enter your name"
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
            />
          </div>
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
            />
          </div>
          <div className="mt-7">
            <label
              htmlFor="password"
              className="text-md font-medium text-gray-700 dark:text-white"
            >
              Password
            </label>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
            />
          </div>
          <div className="mt-7">
            <label
              htmlFor="profile_picture"
              className="text-md font-medium text-gray-700"
            >
              <div className="text-center w-full p-4 bg-indigo-300 rounded-2xl hover:cursor-pointer hover:bg-indigo-400 truncate ">
                {profileState ? profileState : "upload profile picture"}
              </div>
            </label>
            <input
              onChange={handleProfilePicture}
              type="file"
              accept="image/*"
              name="profile_picture"
              id="profile_picture"
              required
              className="hidden"
            />
          </div>
          <button
            className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Register"}
          </button>
        </form>
        <p className="text-center text-sm mt-2 text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
