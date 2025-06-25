"use client";
import { socket } from "@/lib/socket";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";

const UserCard = ({ id, pic, name, message, onClose, seen }) => {

  const [isOnline, setOnline] = useState([]);
  const [seenMessage, setSeenMessage] = useState(seen);
  useEffect(() => {
    setSeenMessage(seen);
  }, [message]);

  useLayoutEffect(() => {

      socket.emit("get-online-users");
      socket.on("online-users", (users) => {
        setOnline(users.includes(id));
      });
    
    return () => {
      socket.off("online-users");
    };
  }, []);

  return (
    <Link
      className="w-full h-15 bg-slate-300 dark:bg-Dark flex items-center px-2 rounded-xl "
      href={`/message/${id}`}
      onClick={() => {
        setSeenMessage(true);
        if (onClose) {
          onClose();
        }
      }}
    >
      <div className="w-12 h-12 relative">
        <Image
          className="rounded-full overflow-hidden size-12"
          src={pic}
          sizes="100%"
          alt="profile"
          width={0}
          height={0}
          quality={50}
        />
        <div
          className={`absolute bottom-1 right-0 size-3 z-10 ${
            isOnline ? "bg-green-600" : "bg-red-600"
          } rounded-full`}
        />
      </div>
      <div className="flex items-center flex-1 justify-between">
        <div className="flex flex-col items-start ml-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </p>
          {message && (
            <p
              className={`text-xs text-gray-500 overflow-hidden max-w-[100px] truncate dark:text-LightWhite ${
                seenMessage === false ? "font-bold text-[11px]" : ""
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {message && seenMessage === false && (
          <div className={` size-3 bg-green-600 rounded-full`} />
        )}
      </div>
    </Link>
  );
};

export default UserCard;
