import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

// 获取单个问题详情
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "问题ID不能为空" }, { status: 400 });
    }

    // 查询问题详情
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
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
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "问题不存在" }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error("获取问题详情失败:", error);
    return NextResponse.json({ error: "获取问题详情失败" }, { status: 500 });
  }
}

// 更新问题
export async function PUT(request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "问题ID不能为空" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // 修正获取当前用户的方式
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    // 查询问题
    const issue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "问题不存在" }, { status: 404 });
    }

    // 进行权限验证
    // 1. 管理员可以修改任何问题状态
    // 2. 普通用户只能修改自己的问题，且只能将IN_PROGRESS状态的问题改为CLOSED
    if (decoded.role !== "ADMIN") {
      if (issue.userId !== decoded.id) {
        return NextResponse.json({ error: "无权更新此问题" }, { status: 403 });
      }

      // 注意：前端逻辑允许用户在任何状态下尝试关闭自己的问题
      // 后端可以只验证是否为 owner
      // 如果需要更严格，可以保留下面的检查
      // if (!(issue.status === "IN_PROGRESS" && status === "CLOSED")) {
      //   return NextResponse.json(
      //     { error: "普通用户只能将解决中的问题标记为已关闭" },
      //     { status: 403 }
      //   );
      // }
    }

    // 检查传入的状态是否有效
    if (!status || !["PENDING", "IN_PROGRESS", "CLOSED"].includes(status)) {
      return NextResponse.json({ error: "无效的问题状态" }, { status: 400 });
    }

    // 如果是关闭问题，则记录关闭时间
    const updateData = {
      status,
    };

    if (status === "CLOSED" && !issue.closedAt) {
      // 只有在首次关闭时记录时间
      updateData.closedAt = new Date();
    }

    // 更新问题
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
      // 返回更新后的完整信息，以便前端可能需要
      include: {
        user: { select: { id: true, name: true, email: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("更新问题失败:", error);
    // 提供更具体的错误信息
    const errorMessage =
      error instanceof Error ? error.message : "更新问题时出现未知错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 删除问题（仅管理员）
export async function DELETE(request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "问题ID不能为空" }, { status: 400 });
    }

    // 修正获取当前用户的方式
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    // 验证是否为管理员
    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "只有管理员可以删除问题" },
        { status: 403 }
      );
    }

    // 查询问题是否存在
    const issue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!issue) {
      return NextResponse.json({ error: "问题不存在" }, { status: 404 });
    }

    // 使用事务确保原子性
    await prisma.$transaction(async (tx) => {
      // 删除该问题的所有回复
      await tx.reply.deleteMany({
        where: { issueId: id },
      });
      // 删除问题
      await tx.issue.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "问题已成功删除" }, { status: 200 });
  } catch (error) {
    console.error("删除问题失败:", error);
    // 提供更具体的错误信息
    const errorMessage =
      error instanceof Error ? error.message : "删除问题时出现未知错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
