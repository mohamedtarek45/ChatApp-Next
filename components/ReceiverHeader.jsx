"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { socket } from "@/lib/socket";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
const ReceiverHeader = ({ reciver }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  useLayoutEffect(() => {
    socket.emit("get-online-users");
    socket.on("online-users", (users) => setOnlineUsers(users));

    return () => {
      socket.off("online-users");
    };
  }, []);

  const isOnline = onlineUsers.includes(reciver._id);
  return (
    <header className="h-15 sticky top-0 bg-slate-300 dark:bg-ExtraDark flex items-center">
      <Link href="/home" className="block sm:hidden pl-1 ">
        <IoChevronBackOutline size={25} />
      </Link>
      <div className="flex px-2 items-center h-full flex-1">
        <div className="w-12 h-12 relative">
          <Image
            src={reciver.profile_picture}
            alt="profile"
            fill
            className="rounded-full overflow-hidden"
            quality={55}
            sizes="100%"
            priority={false}
          />
          <div
            className={`absolute bottom-1 right-0 size-3  ${
              isOnline ? "bg-green-600" : "bg-red-600"
            } rounded-full`}
          />
        </div>
        <div className="ml-2 ">
          <p className="text-lg font-bold text-slate-800 dark:text-white">
            {reciver.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-LightWhite">
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>
    </header>
  );
};

export default ReceiverHeader;
