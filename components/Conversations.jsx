"use client";
import { getAllConversations, getUsersById } from "@/lib/actions";
import { useStore } from "@/store/storeUser";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import UserCard from "./UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname } from "next/navigation";
const Conversations = () => {
  const pathname = usePathname();
  const isMessagePage = pathname.startsWith("/message/");
  const reciverId = isMessagePage ? pathname.split("/")[2] : null;
  const user = useStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("updateConversation", async (data) => {
      if (!user || !users) return;

      let updatedUsers = [];
      let updatedUser = null;

      for (const u of users) {
        if (u.id === data.sender || u.id === data.reciver) {
          updatedUser = {
            ...u,
            lastMessage: data.text || (data.url ? data.type : ""),
            seen:
              data.sender === user.id || data.sender === reciverId || data.seen,
          };
  
        } else {
          updatedUsers.push(u);
        }
      }
      if (updatedUser) {
        setUsers([updatedUser, ...updatedUsers]);
        return;
      }

      let userID = data.sender === user.id ? data.reciver : data.sender;
      const Getuser = await getUsersById(userID);
      updatedUser = {
        ...Getuser,
        seen: false,
        lastMessage: data.text || (data.url ? data.type : ""),
      };
      setUsers([updatedUser, ...updatedUsers]);
    });
    return () => {
      socket.off("updateConversation");
    };
  }, [user?.id, users,reciverId]);
  useEffect(() => {
    if (!user) return;
    const loadAll = async () => {
      setLoading(true);
      const conversations = await getAllConversations(user.id);
      const usersWithMessages = await Promise.all(
        conversations.map(async (con) => {
          const otherUserId =
            con.sender === user.id ? con.receiver : con.sender;
          const userInfo = await getUsersById(otherUserId);
          return {
            ...userInfo,
            seen: con.MessageSender === user.id ? true : con.seen,
            lastMessage: con.lastMessage,
          };
        })
      );
      setUsers(usersWithMessages);
      setLoading(false);
    };
    loadAll();
  }, [user?.id]);
  if (loading) {
    return (
      <div className=" w-full flex-1 flex justify-center items-center">
        <LoadingSpinner className="text-gray-400 dark:text-Dark size-10 fill-blue-600" />
      </div>
    );
  }
  return (
    <div
      className={`${
        isMessagePage ? "hidden sm:block" : "block"
      } w-full flex-1 overflow-x-hidden overflow-y-auto space-y-2 px-1`}
    >
      {users.map((usr) => (
        <UserCard
          key={usr.id}
          id={usr.id}
          pic={usr.profile_picture}
          name={usr.name}
          seen={usr.seen}
          message={usr.lastMessage}
        />
      ))}
      {users.length === 0 && (
        <p className="text-center text-lg text-slate-400">
          Explore users to start a conversation
        </p>
      )}
    </div>
  );
};

export default Conversations;
