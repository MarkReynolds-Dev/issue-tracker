import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";
import { isValidEmail } from "@/app/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "请提供姓名、邮箱和密码" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度必须大于或等于6位" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    // 对密码进行哈希处理
    const hashedPassword = await hashPassword(password);

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // 默认为普通用户
      },
    });

    // 返回用户信息（不包含密码）
    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ error: "注册过程中出现错误" }, { status: 500 });
  }
}
