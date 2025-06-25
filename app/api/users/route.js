
import { getUsersByName } from "@/lib/actions";
export async function GET(req) 
{
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const id = searchParams.get("excludeId");
  const users =await getUsersByName(search,id);
  return Response.json(users);
}
