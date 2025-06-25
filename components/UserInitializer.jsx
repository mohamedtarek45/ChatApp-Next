"use client";
import { socket } from "@/lib/socket";
import { useStore } from "@/store/storeUser";
import { useEffect } from "react";
const UserInitializer = ({ user, children }) => {
  const loginUser = useStore((state) => state.loginUser);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      socket.emit("user-connected-id", String(user._id));
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (user) {
      loginUser(user);
    }
  }, [user]);
  return children;
};

export default UserInitializer;
