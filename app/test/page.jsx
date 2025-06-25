"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  const [myId, setMyId] = useState("");
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); 
    }

    socket.on("connect", () => {
   
      setMyId(socket.id); // كده كفاية
    });
    // استلام ID الخاص بك من السيرفر
    socket.on("your-id", (id) => {
  
      setMyId(id);
    });

    // استلام رسالة عامة
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, `Public: ${msg}`]);
    });

    // استلام رسالة خاصة
    socket.on("receive-private", ({ from, message }) => {
      setMessages((prev) => [...prev, `Private from ${from}: ${message}`]);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      setMyId("");
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("your-id");
      socket.off("receive-message");
      socket.off("receive-private");
      socket.off("disconnect");
    };
  }, []);

  const sendPublic = () => {
    socket.emit("send-message", message);
    setMessage("");
  };

  const sendPrivate = () => {
    socket.emit("private-message", { to: receiverId, message });
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧑‍💻 My ID: {myId}</h2>

      <input
        type="text"
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginRight: 8 }}
      />

      <button onClick={sendPublic}>Send Public</button>

      <br />
      <br />

      <input
        type="text"
        placeholder="Receiver socket ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={sendPrivate}>Send Private</button>

      <h3 className="text-white dark:text-red-600">💬 Messages:</h3>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
