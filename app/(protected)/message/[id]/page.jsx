
import {  getUser } from "@/lib/actions";

import ReceiverHeader from "@/components/ReceiverHeader";
import Messages from "@/components/Messages";

const page = async ({ params }) => {
  const { id } = await params;
  const reciver = await getUser(id);

  return <div className="flex flex-col h-screen ">
    <ReceiverHeader reciver={reciver} />
    <Messages reciver={reciver} />
  </div>;
};

export default page;
