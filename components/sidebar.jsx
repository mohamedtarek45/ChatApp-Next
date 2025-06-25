import SelectUser from "@/components/SelectUser";
import Navigation from "@/components/Navigation";
const sidebar = async () => {
  return (
    <div className="h-full w-full grid grid-cols-[48px_1fr] ">
      <Navigation  />
      <SelectUser />
    </div>
  );
};

export default sidebar;
