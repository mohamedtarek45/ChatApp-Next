import MessagePage from "@/components/MessagePage";
import SendMessage from "@/components/SendMessage";
import SeenMessage from "@/components/SeenMessage";
const Messages = ({ reciver }) => {
  return (
    <div
  className={`flex-1 flex flex-col overflow-y-hidden bg-no-repeat bg-cover 
    bg-[url('/LightWallapaper.webp')] dark:bg-[url('/test.png')]`}
    >
      <SeenMessage reciver={reciver}/>
      <MessagePage reciver={reciver} />
      <SendMessage reciver={reciver} />
    </div>
  ); 
};

export default Messages;
