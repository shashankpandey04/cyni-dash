import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default async function Dashboard() {
  const auth = await getAuth();

  if (!auth || auth.type !== "guild") {
    redirect("/login");
  }

  if (auth.permission_level > 2) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        {auth.guild_name} Dashboard
      </h1>
    </div>
  );
}
