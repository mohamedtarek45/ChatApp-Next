"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { updateUser } from "@/lib/actions";
import { useStore } from "@/store/storeUser";
import { useActionState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { uploadProfileToCloudinary } from "@/lib/upoladToCloud";
export default function ModalEditUser({ isOpen, onClose, user }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, Action, isPending] = useActionState(updateUser, {});
  const [input, setInput] = useState(null);
  const login = useStore((state) => state.loginUser);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const action = (formData) => {
    if (formData.get("name") === user.name && !input) {
      onClose();
      return;
    }
    let newFormData = new FormData();
    newFormData.append("id", user.id);
    newFormData.append("name", formData.get("name"));
    newFormData.append("email", user.email);
    newFormData.append(
      "profile_picture",
      input ? input.url : user.profile_picture
    );
    Action(newFormData);
    const obj = {
      _id: user.id,
      name: formData.get("name"),
      email: user.email,
      profile_picture: input ? input.url : user.profile_picture,
    };
    login(obj);
    setInput(null);
    onClose();
  };
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("File size should be less than 1.5MB");
      e.target.value = "";
      setInput(null);
    } else {
      setLoading(true);
      const url = await uploadProfileToCloudinary(file);
      setLoading(false);
      setInput({ name: file.name, url: url });
    }
  };
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center "
      onClick={handleOverlayClick}
    >
      <Toaster />
      <div className="shadow-sm rounded-2xl w-full max-w-md p-4 bg-slate-200 mx-auto relative dark:bg-ExtraDark border-2 border-gray-800">
        <button
          className="text-slate-500 hover:text-slate-800 hover:cursor-pointer text-lg absolute top-1 right-4"
          onClick={onClose}
        >
          <IoMdCloseCircle size={25} />
        </button>
        <form action={action} className="space-y-3">
          <h1 className="text-center text-ExtraDark dark:text-white">
            Edit your profile
          </h1>
          <div>
            <label
              htmlFor="name"
              className="text-md font-medium text-gray-700 dark:text-white"
            >
              Name
            </label>
            <input
              defaultValue={user.name}
              placeholder="Enter your name"
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md   shadow-sm outline-1   focus:outline-indigo-700 dark:focus:outline-indigo-700  dark:outline-gray-700 outline-indigo-200 sm:text-md p-3"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-md font-medium text-gray-700 dark:text-white"
            >
              Email
            </label>
            <input
              defaultValue={user.email}
              disabled
              type="text"
              name="email"
              id="Email"
              className="mt-1 text-LightWhite dark:text-Dark block w-full rounded-md hover:cursor-not-allowed shadow-sm outline-1 dark:outline-gray-700 outline-indigo-200 sm:text-md p-3"
            />
          </div>

          <label
            htmlFor="photo"
            className="text-md font-medium text-gray-700 dark:text-white hover:cursor-pointer"
          >
            <div className="text-center bg-gray-400 py-2 rounded-xl truncate px-2">
              {input ? input.name : "Change your photo"}
            </div>
          </label>
          <input
            onChange={handlePhoto}
            type="file"
            accept="image/*"
            name="photo"
            id="photo"
            className="hidden"
          />

          <hr className="my-4 border-gray-400" />
          <div className="py-1 flex justify-center space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg bg-[#993A3F] px-7 py-2 text-white   hover:cursor-pointer dark:hover:bg-[#7D2F33]"
            >
              Close
            </button>
            <button
              disabled={isPending || loading}
              className="rounded-lg bg-[#32CD32] px-7 py-2 text-white hover:cursor-pointer dark:hover:bg-[#28A428]"
            >
              {isPending || loading ? (
                <>
                  <LoadingSpinner
                    className={
                      "size-5 text-gray-200  dark:text-gray-600 fill-blue-600"
                    }
                  />
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.querySelector("#myportal")
  );
}
