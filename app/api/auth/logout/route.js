import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 清除token cookie
    const cookieStore = await cookies();
    cookieStore.delete("token");

    // 重定向到首页
    const redirectUrl = new URL(
      "/",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );

    // 创建重定向响应，并明确指示不缓存
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("退出登录失败:", error);
    // 即使出错，也尝试重定向到首页
    const errorRedirectUrl = new URL(
      "/",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );
    return NextResponse.redirect(errorRedirectUrl);
  }
}
