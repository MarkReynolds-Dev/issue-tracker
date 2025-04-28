import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // 清除token cookie
  cookies().delete("token");

  // 重定向到首页
  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
}
