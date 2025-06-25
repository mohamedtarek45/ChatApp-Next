import Conversations from "@/components/Conversations";

const SelectUser = async() => {


  return (
    <div className="flex flex-col h-screen bg-white dark:bg-LightDark ">
      <h3 className="px-3 text-slate-600 dark:text-white">Message</h3>
      <Conversations />
    </div>
  );
};

export default SelectUser;
