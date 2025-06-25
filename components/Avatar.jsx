"use client";

import ModalEditUser from "@/components/ModalEditUser";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/store/storeUser";
import { usePathname } from "next/navigation";
const Avatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const pathname = usePathname();
  const isMessagePage = pathname.startsWith("/message/");

  return (
    <div className={`relative w-12 h-12 ${isMessagePage && "hidden sm:block"}`} >
      {user?.profile_picture && (
        <Image
          onClick={() => setIsOpen(true)}
          className="rounded-full overflow-hidden p-2 hover:cursor-pointer"
          src={user.profile_picture}
          alt="profile"
          fill
          sizes="100%"
          priority={false}
        />
      )}
      <ModalEditUser
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Avatar;
