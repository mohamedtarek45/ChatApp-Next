import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import { CiLogout } from "react-icons/ci";

import NavLink from "@/components/NavLink";
import { logout } from "@/lib/actions";
import Avatar from "@/components/Avatar";
import SearchUsers from "@/components/SearchUsers";
import ToggleTheme from "@/components/ToggleTheme";
const Navigation = () => {
  return (
    <div className="bg-slate-500 dark:bg-ExtraDark h-full py-5 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 ">
          <NavLink href="/home">
            <IoChatbubbleEllipsesSharp size={25} color="white" />
          </NavLink>
        </div>
        <SearchUsers />
        <ToggleTheme />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Avatar />
        <div className="w-12 h-12">
          <form action={logout} className="w-full h-full">
            <button className=" hover:cursor-pointer w-full h-full flex items-center justify-center hover:bg-slate-400">
              <CiLogout size={25} color="white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
