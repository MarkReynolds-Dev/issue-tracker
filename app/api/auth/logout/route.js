import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 清除token cookie
    const cookieStore = cookies();
    cookieStore.delete("token");

    // 重定向到首页
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  } catch (error) {
    console.error("退出登录失败:", error);
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  }
}
