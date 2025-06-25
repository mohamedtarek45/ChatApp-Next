"use client";
import { socket } from "@/lib/socket";
import { seenMessage } from "@/lib/actions";
import { useStore } from "@/store/storeUser";
import { useEffect } from "react";
const SeenMessage = ({ reciver }) => {
  const user = useStore((state) => state.user);
  useEffect(() => {
    if (!reciver||!user) return;
    async function seen() {
      const result = await seenMessage(user.id, reciver._id);
      if (result) {
        socket.emit("seen-message", user.id, reciver._id);
      }
    }
    seen();
  }, [reciver._id,user?.id]);
  return null;
};

export default SeenMessage;
