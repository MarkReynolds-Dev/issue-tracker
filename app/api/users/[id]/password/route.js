import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
// import { cookies } from "next/headers"; // No longer needed directly
// import { verifyToken, verifyPassword, hashPassword } from "@/app/lib/auth"; // verifyToken not needed directly
import { getCurrentUser, verifyPassword, hashPassword } from "@/app/lib/auth"; // Import getCurrentUser

// 修改密码
export async function PUT(request, { params }) {
  try {
    // Await params directly
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 });
    }

    // 验证用户身份 (使用 getCurrentUser)
    const accessingUser = await getCurrentUser();

    if (!accessingUser) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 只能修改自己的密码，除非是管理员
    if (accessingUser.id !== id && accessingUser.role !== "ADMIN") {
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

    // 检查用户是否存在 (目标用户)
    const targetUser = await prisma.user.findUnique({
      where: { id }, // id is the target user's id from params
      select: {
        id: true,
        password: true, // Need the target user's password hash
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 验证当前密码 (验证 targetUser 的密码)
    const isPasswordValid = await verifyPassword(
      currentPassword,
      targetUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }

    // 生成新密码的哈希值
    const hashedNewPassword = await hashPassword(newPassword);

    // 更新密码 (更新 targetUser 的密码)
    await prisma.user.update({
      where: { id }, // id is the target user's id
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: "密码修改成功" });
  } catch (error) {
    console.error("修改密码失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "修改密码时出现未知错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
