import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { cookies } from "next/headers";
import { verifyToken, verifyPassword, hashPassword } from "@/app/lib/auth";

// 修改密码
export async function PUT(request, { params }) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 });
    }

    // 验证用户身份
    const cookieStore = cookies();
    const token = await cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "会话已过期，请重新登录" },
        { status: 401 }
      );
    }

    // 只能修改自己的密码，除非是管理员
    if (decoded.id !== id && decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    // 获取请求体
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // 验证必填字段
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "当前密码和新密码不能为空" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "新密码长度不能少于6个字符" },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 验证当前密码
    const isPasswordValid = await verifyPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }

    // 生成新密码的哈希值
    const hashedNewPassword = await hashPassword(newPassword);

    // 更新密码
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: "密码修改成功" });
  } catch (error) {
    console.error("修改密码失败:", error);
    return NextResponse.json({ error: "修改密码时出现错误" }, { status: 500 });
  }
}
