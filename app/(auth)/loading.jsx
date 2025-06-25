import LoadingSpinner from "@/components/LoadingSpinner";

const  Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadingSpinner className="text-gray-400 dark:text-Dark size-10 fill-blue-600" />
    </div>
  );
};

export default  Loading;