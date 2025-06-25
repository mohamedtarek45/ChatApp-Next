"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { useStore } from "@/store/storeUser";
import UserCard from "@/components/UserCard";
export default function Modal({ isOpen, onClose }) {
  const user = useStore((state) => state.user);
  const [loadind, setLoading] = useState(false); // ايقي اعملها 
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim() !== "") {
        const response = await fetch(
          `/api/users?search=${search}&excludeId=${user.id}`
        );
        const data = await response.json();
        setUsers(data);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, user]);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center retaltive"
      onClick={handleOverlayClick}
    >
      <div className="shadow-sm rounded-md w-full max-w-md p-4 bg-slate-200 dark:bg-ExtraDark mx-auto relative flex flex-col">
        <button
          className="text-slate-500 hover:text-slate-800 dark:text-white hover:cursor-pointer text-lg absolute top-1 right-4"
          onClick={onClose}
        >
          <IoMdCloseCircle size={25} />
        </button>

        <input
          type="text"
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full rounded-md border-gray-300 shadow-sm outline-1 outline-indigo-200 focus:outline-indigo-400 sm:text-md p-3"
        />
        <div className="h-[300px] py-3 mt-2 overflow-y-auto space-y-2">
          {search.length > 0 ? (
            users.map((user, i) => <UserCard key={i} id={String(user._id)} pic={user.profile_picture} name={user.name} onClose={onClose} />)
          ) : (
            <p className="text-center text-lg text-slate-400">
              Explore users to start a conversation
            </p>
          )}
        </div>
      </div>
    </div>,
    document.querySelector("#myportal")
  );
}
