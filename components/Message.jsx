import Image from "next/image";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const Message = ({ message, seen, isMe, createdAT ,isLastMessage}) => {
  const date = new Date(createdAT);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div className={`flex  ${isMe ? "justify-end" : ""}`}>
      <div
        className={`px-4 py-2 ${
          isMe ? "bg-[#C2F2E9]" : "bg-white"
        } w-fit m-5 rounded-2xl relative`}
      >
        <div className="max-w-[400px] max-h-[80vh]">
          {message.url &&
            (message.type === "image" ? (
              <Image
                src={message.url}
                alt="image"
                width={0}
                height={0}
                quality={55}
                sizes="100%"
                priority={false}
                className="w-auto h-auto max-w-full max-h-[80vh]"
              />
            ) : (
              <video
                src={message.url}
                alt="video"
                controls
                className="max-w-full max-h-[80vh] rounded-lg"
              />
            ))}
        </div>
        <p className="text-ExtraDark">{message.text}</p>
        {isMe ? (
          <IoMdArrowDropright
            className="absolute bottom-[calc(50%-12.5px)] right-[-15px] text-[#C2F2E9]"
            size={25}
          />
        ) : (
          <IoMdArrowDropleft
            className="absolute bottom-[calc(50%-12.5px)] left-[-15px] text-white"
            size={25}
          />
        )}
        <div className="flex space-x-2 justify-between">
          {isMe && isLastMessage && (
            <p className="  text-green-800 text-[12px]">
              {seen ? "Seen" : "Not Yet"}
            </p>
          )}
          <p className="text-[12px] text-black ">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
