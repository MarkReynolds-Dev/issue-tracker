import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/db";
import { verifyPassword, generateToken } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json({ error: "请提供邮箱和密码" }, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 如果用户不存在或密码不匹配
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

    // 生成JWT令牌
    const token = generateToken(user);

    // 设置Cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1天
      path: "/",
    });

    // 返回用户信息（不包含密码）
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json({ error: "登录过程中出现错误" }, { status: 500 });
  }
}
