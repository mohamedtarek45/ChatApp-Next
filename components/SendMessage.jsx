"use client";
import { useStore } from "@/store/storeUser";
import AddImageOrVideo from "@/components/AddImageOrVideo";
import { IoSend } from "react-icons/io5";
import { sendMessage } from "@/lib/actions";
import { useActionState, useState } from "react";
import { socket } from "@/lib/socket";
import { useFileStore } from "@/store/storeFile";

const SendMessage = ({ reciver }) => {
  const user = useStore((state) => state.user);
  const [input, setInput] = useState("");
  const file = useFileStore((state) => state.file);
  const deleteImageOrVideo = useFileStore((state) => state.deleteImageOrVideo);
  const action = async (e) => {
    e.preventDefault();
    if (!input && !file) {
      return;
    }
    const newFormData = new FormData();
    newFormData.append("message", input);
    if (file) {
      newFormData.append("URL", file.src);
      newFormData.append("type", file.type);
    }
    newFormData.append("sender", user.id);
    newFormData.append("reciver", reciver._id);
    socket.emit("sendMessage", {
      sender: user.id,
      reciver: reciver._id,
      text: input,
      type: file ? file.type : null,
      url: file ? file.src : null,
      seen: false,
      createdAt: new Date().toString(),
    });
    setInput("");
    await sendMessage(newFormData);
    socket.emit("SendSeen", {
      sender: user.id,
      reciver: reciver._id,
      text: input,
      type: file ? file.type : null,
      url: file ? file.src : null,
      seen: false,
      createdAt: new Date().toString(),
    });
    deleteImageOrVideo();
  };
  return (
    <form
      className="h-14 flex bg-white items-center space-x-2 dark:bg-ExtraDark border-t-2 border-t-Dark "
      onSubmit={action}
    >
      <AddImageOrVideo />
      <div className="flex-1">
        <input
          value={input}
          autoComplete="off"
          onChange={(e) => setInput(e.target.value)}
          type="text"
          name="message"
          className="w-full outline-1 outline-slate-600  rounded-full p-2 text-lg"
          placeholder="Type your message"
        />
      </div>
      <div className="mr-3 flex">
        <button>
          <IoSend
            size={26}
            className="hover:cursor-pointer hover:text-green-500 text-ExtraDark dark:text-white"
          />
        </button>
      </div>
    </form>
  );
};

export default SendMessage;
