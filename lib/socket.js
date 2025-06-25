"use client";

import { io } from "socket.io-client";
//
export const socket = io("https://flowery-hexagonal-thrill.glitch.me", {
  autoConnect: false,
  // withCredentials:true
});
