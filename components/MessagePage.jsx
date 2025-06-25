"use client";
import Image from "next/image";
import Message from "@/components/Message";
import { useState, useEffect } from "react";
import { Element, scroller } from "react-scroll";
import { useFileStore } from "@/store/storeFile";
import { IoMdCloseCircle } from "react-icons/io";
import { getAllMessages } from "@/lib/actions";
import { useStore } from "@/store/storeUser";
import { socket } from "@/lib/socket";
import { seenMessage } from "@/lib/actions";
const MessagePage = ({ reciver }) => {
  const user = useStore((state) => state.user);
  const file = useFileStore((state) => state.file);
  const loading = useFileStore((state) => state.loading);
  const [messages, setMessages] = useState([]);
  const deleteImageOrVideo = useFileStore((state) => state.deleteImageOrVideo);
  useEffect(() => {
    scroller.scrollTo("lastMessagee", {
      duration: 100,
      offset: 99999999,
      containerId: "container",
      smooth: "easeInOutQuart",
    });
  }, [messages]);
  useEffect(() => {
    async function seen() {
      const result = await seenMessage(user.id, reciver._id);
      if (result) {
        socket.emit("seen-message",  user.id,reciver._id);
      }
    }
    socket.on("SeenConfirmation",data=>{
      if(data.sender===reciver._id){
        seen();
      }
    })
    socket.on("updateMessages", (data) => {
      if (data.sender === reciver._id) {
        setMessages((prev) => [...prev, data]);
      }
      if(data.sender===user.id){
        setMessages((prev) => [...prev, data]);
      }
    });
    socket.on("updateSeenMessage", (data) => {
  
      if (data === reciver._id) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          let lastMessage = prev[prev.length - 1];
          lastMessage.seen = true;
          return [...prev.slice(0, -1), lastMessage];
        });
      }
    });
    return () => {
      socket.off("updateMessages");
      socket.off("updateSeenMessage");
      socket.off("SeenConfirmation");
    };
  }, [user?.id]);
  useEffect(() => {
    const getMessage = async () => {
      if (user && reciver) {
        const messages = await getAllMessages(reciver._id, user.id);

        setMessages(messages);
      }
    };
    getMessage();
  }, [reciver, user]);

  return (
    <div className="relative overflow-y-hidden flex-1">
      <div className="overflow-y-scroll max-h-full" id="container">
        {messages.map((msg, i) => (
          <Message
            isLastMessage={messages.length - 1 === i}
            key={i}
            message={msg}
            seen={msg.seen}
            isMe={msg.sender === user.id}
            createdAT={msg.createdAt}
          />
        ))}

        <Element name="lastMessagee" />
      </div>
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {file && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="relative max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden ">
            <IoMdCloseCircle
              className="absolute top-1 right-1 text-red-500 hover:cursor-pointer z-20"
              size={25}
              onClick={deleteImageOrVideo}
            />
            {file.type === "image" && (
              <Image
                src={file.src}
                alt="image"
                width={0}
                height={0}
                quality={55}
                sizes="100%"
                priority={false}
                className="w-auto h-auto max-w-full max-h-[80vh]"
              />
            )}
            {file.type === "video" && (
              <video
                src={file.src}
                alt="video"
                controls
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
