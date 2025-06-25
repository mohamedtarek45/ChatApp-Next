"use client";
import { FaImage } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useFileStore } from "@/store/storeFile";
import { uploadMessageToCloudinary } from "@/lib/upoladToCloud";
const AddImageOrVideo = () => {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);
  const addImageOrVideo = useFileStore((state) => state.addImageOrVideo);
  const setLoading = useFileStore((state) => state.setLoading);
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = "";
      return;
    }
    setLoading(true);
    const Url = await uploadMessageToCloudinary(file);
    setLoading(false);
    if (type === "image") {
      addImageOrVideo("image", Url);
    } else {
      addImageOrVideo("video", Url);
    }
   
    e.target.value = "";
    setShowOptions(false);
  };
  useEffect(() => {
    if (showOptions) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="relative" ref={menuRef}>
      <Toaster />
      <IoAddCircle
        size={30}
        onClick={() => setShowOptions(!showOptions)}
        className={`ml-2 hover:cursor-pointer  text-green-500  hover:text-green-700 transition-all duration-300 ${
          showOptions ? "rotate-[405deg] " : "rotate-0"
        } `}
      />
      <input
        type="file"
        name="SendImage"
        accept="image/*"
        id="SendImage"
        className="hidden"
        onChange={(e) => handleFileChange(e, "image")}
      />

      <input
        type="file"
        accept="video/*"
        name="SendVideo"
        id="SendVideo"
        className="hidden"
        onChange={(e) => handleFileChange(e, "video")}
      />
      {showOptions && (
        <div className="absolute top-[-90px] left-2 bg-slate-200 rounded-md shadow-lg p-2 w-30 z-10">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="SendImage"
              className="flex space-x-2 hover:text-[#00acb4] hover:cursor-pointer text-slate-800 items-center"
            >
              <FaImage size={20} />
              <p className="text-md ">Image</p>
            </label>

            <label
              htmlFor="SendVideo"
              className="flex space-x-2 hover:text-[#00acb4] hover:cursor-pointer text-slate-800 items-center"
            >
              <FaVideo size={20} />
              <p className="text-md ">Video</p>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddImageOrVideo;
