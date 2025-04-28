import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

// 获取问题列表
export async function GET(request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const userOnly = searchParams.get("userOnly") === "true";

    // 获取当前用户
    const currentUser = await getCurrentUser(request);
    console.log("当前用户:", currentUser);

    if (userOnly && !currentUser) {
      console.log("访问个人问题列表需要登录");
      return NextResponse.json(
        { error: "请先登录后再查看个人问题" },
        { status: 401 }
      );
    }

    // 构建查询条件
    const where = {};

    // 根据状态筛选
    if (status) {
      where.status = status;
    }

    // 根据搜索词筛选
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // 如果是查看个人问题，只显示当前用户的问题
    if (userOnly && currentUser) {
      where.userId = currentUser.id;
    }

    // 如果不是管理员，只能看到自己的问题
    if (currentUser && currentUser.role !== "ADMIN" && !userOnly) {
      where.userId = currentUser.id;
    }

    // 查询总数
    const total = await prisma.issue.count({ where });

    // 查询问题列表
    const issues = await prisma.issue.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
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
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      issues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取问题列表失败:", error);
    return NextResponse.json(
      { error: "获取问题列表时出现错误" },
      { status: 500 }
    );
  }
}

// 创建新问题
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // 验证必填字段
    if (!title || !description) {
      console.log("缺少必填字段");
      return NextResponse.json(
        { error: "请提供问题标题和描述" },
        { status: 400 }
      );
    }

    // 获取当前用户
    const currentUser = await getCurrentUser(request);
    console.log("当前用户:", currentUser);

    if (!currentUser) {
      console.log("未登录用户尝试提交问题");
      return NextResponse.json(
        { error: "请先登录后再提交问题" },
        { status: 401 }
      );
    }

    // 管理员不能提交问题
    if (currentUser.role === "ADMIN") {
      console.log("管理员尝试提交问题");
      return NextResponse.json(
        { error: "管理员不能提交问题" },
        { status: 403 }
      );
    }

    // 创建新问题
    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status: "PENDING",
        userId: currentUser.id,
      },
    });

    console.log("问题创建成功:", newIssue);
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("创建问题失败:", error);
    return NextResponse.json({ error: "创建问题时出现错误" }, { status: 500 });
  }
}
