import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

function Logout(request, path) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("token");
  response.cookies.delete("userInfo");
  response.headers.set("x-pathname", path);
  return response;
}
const protectedRoutes = ["/home"];
const publicRoutes = ["/login", "/register", "/password"];

export async function middleware(request) {
  let cookieToken = request.cookies.get("token");
  let cookieUserinfo = request.cookies.get("userInfo");
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.includes(path);
  const isPublic = publicRoutes.includes(path);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  if (isProtected) {
    if (!cookieToken) {
      return Logout(request, path);
    }
    try {
      const data = await decrypt(cookieToken.value);
      if (data) {
        return NextResponse.next();
      }
    } catch (error) {
      return Logout(request, path);
    }
  }
  if (isPublic) {
    if (path === "/password" && !cookieUserinfo) {
      return Logout(request, path);
    }
    if (cookieToken) {
      try {
        const verify = await decrypt(cookieToken.value);
        if (verify) {
          const response = NextResponse.redirect(new URL("/home", request.url));
          response.headers.set("x-pathname", path);
          return response;
        }
      } catch (error) {
        return Logout(request, path);
      }
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}
