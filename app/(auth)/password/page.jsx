
import { cookies } from "next/headers";
import FormPassword from "@/components/formPassword";
const page = async () => {
  const cookiesStore = await cookies();

  const userInfo = JSON.parse(cookiesStore.get("userInfo").value);

  return (
    <div className="mt-20 sm:mt-5  w-full px-4">
      <div className="shadow-sm rounded-md w-full max-w-md p-4 bg-slate-200 dark:bg-ExtraDark mx-auto dark:border-1 dark:border-gray-800">
        <h3 className="text-center">Welcome to Chat App</h3>
        <FormPassword userInfo={userInfo} />
      </div>
    </div>
  );
};

export default page;
