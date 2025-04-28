import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

// 创建问题回复
export async function POST(request, { params }) {
  try {
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: "问题ID不能为空" }, { status: 400 });
    }

    const body = await request.json();
    const { content } = body;

    // 验证必填字段
    if (!content) {
      return NextResponse.json({ error: "回复内容不能为空" }, { status: 400 });
    }

    // 获取当前用户
    const cookieStore = cookies();
    const token = await cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "请先登录后再操作" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "会话已过期，请重新登录" },
        { status: 401 }
      );
    }

    // 查询问题是否存在
    const issue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "问题不存在" }, { status: 404 });
    }

    // 验证权限
    // 1. 如果是管理员，可以回复任何问题
    // 2. 如果是普通用户，只能回复自己的问题
    // 3. 如果问题已关闭，则不能再回复
    if (issue.status === "CLOSED") {
      return NextResponse.json(
        { error: "问题已关闭，无法回复" },
        { status: 403 }
      );
    }

    if (decoded.role !== "ADMIN" && issue.userId !== decoded.id) {
      return NextResponse.json(
        { error: "普通用户只能回复自己的问题" },
        { status: 403 }
      );
    }

    // 创建回复
    const reply = await prisma.reply.create({
      data: {
        content,
        issueId: id,
        userId: decoded.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // 如果是管理员回复，自动将问题状态更新为解决中
    if (decoded.role === "ADMIN" && issue.status === "PENDING") {
      await prisma.issue.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("创建回复失败:", error);
    return NextResponse.json({ error: "创建回复时出现错误" }, { status: 500 });
  }
}
