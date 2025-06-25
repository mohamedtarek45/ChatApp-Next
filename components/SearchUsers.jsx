"use client";
import { FaUserPlus } from "react-icons/fa6";
import ModalSearchUser from "@/components/ModalSearchUser";
import { useState } from "react";
const SearchUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-400" onClick={() => setIsOpen(true)}>
        <FaUserPlus size={25} color="white" />
      </div>
      <ModalSearchUser isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
 
export default SearchUsers;
