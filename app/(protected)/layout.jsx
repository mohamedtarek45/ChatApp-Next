import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import Sidebar from "@/components/sidebar";
import UserInitializer from "@/components/UserInitializer";
import { getUser } from "@/lib/actions";
import LayoutWrapper from "@/components/LayoutWrapper";

const layout = async ({ children }) => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token");
  try {
    const userinfo = await decrypt(token.value);
    const user = await getUser(userinfo.id);

    return (
      <UserInitializer user={user}>
        <LayoutWrapper>
          <section className="h-screen max-h-screen bg-slate-200 shadow-md">
            <Sidebar />
          </section>
          {children}
        </LayoutWrapper>
      </UserInitializer>
    );
  } catch (error) {
    console.log("error 2", error);
    return redirect("/login");
  }
};

export default layout;
