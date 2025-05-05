import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
// import { cookies } from "next/headers"; // 不再需要直接用 cookies
// import { verifyToken } from "@/app/lib/auth"; // verifyToken 在 getCurrentUser 内部使用
import { getCurrentUser } from "@/app/lib/auth"; // 导入 getCurrentUser

// 获取用户信息
export async function GET(request, { params }) {
  try {
    // Await params directly during destructuring/property access
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 });
    }

    // 验证用户身份 (使用 getCurrentUser)
    const accessingUser = await getCurrentUser();

    if (!accessingUser) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 只能查询自己的信息，除非是管理员
    if (accessingUser.id !== id && accessingUser.role !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    // 获取目标用户信息 (从数据库)
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "获取用户信息时出现错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 更新用户信息
export async function PUT(request, { params }) {
  try {
    // Await params directly during destructuring/property access
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "用户ID不能为空" }, { status: 400 });
    }

    // 验证用户身份 (使用 getCurrentUser)
    const accessingUser = await getCurrentUser();

    if (!accessingUser) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 只能修改自己的信息，除非是管理员
    if (accessingUser.id !== id && accessingUser.role !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    // 获取请求体
    const body = await request.json();
    const { name } = body;

    // 验证必填字段
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "用户名不能为空" }, { status: 400 });
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("更新用户信息失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "更新用户信息时出现未知错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
