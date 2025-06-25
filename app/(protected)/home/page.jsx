import { ImAirplane } from "react-icons/im";
const page = () => {
  return (
    <div className="hidden bg-gray-300 dark:bg-Dark sm:flex flex-col justify-center items-center">
      <ImAirplane className="text-blue-500 dark:text-blue-700 size-20" />
      <h3 className="text-blue-500 text-2xl font-semibold leading-snug text-center">
        Start chatting with your friends <br /> anytime, anywhere <br />
        fast, secure, and easy to use.
      </h3>
    </div>
  );
};

export default page;
